---
title: 核心概念
---

Qt 采用事件循环机制处理外部响应，并通过元对象系统扩充了 C++，提供了信号和槽、属性、反射等 C++ 目前不支持的功能。

## 事件循环

什么是事件循环呢？

一个图形化的程序，需要响应用户的操作，用户的操作有通过鼠标进行点击、双击、拖拽，通过键盘
进行输入，程序需要针对用户的各类输入行为进行响应，为了能良好的处理用户的交互，Qt 将用户的输入行为封装
为事件，并采用不断循环的方式进行处理。

在 Qt 内部维护了一个队列，当有新的事件产生时，就会加入到这个队列，Qt 会检查队列是否为空，不为空时对事件进行分发，将事件发送到需要响应
的控件树上。

## 信号和槽

Qt 提供了一种新的函数调用方式，比起回调函数更加的方便和直观，只需要在 class 中使用 `signals` 定义一个新的块就可以了。

在使用 Qt 的功能时，class 必须继承自 QObject，并且 private 段要使用 Q_OBJECT 宏，否则功能将不正常工作，很多新手都会忘记这个步骤。

```cpp
class Ping : public QObject {
    Q_OBJECT // <-- 不要忘记这里

public:
    Ping(QObject *parent = nullptr): QObject(parent) {}
    ~Ping() = default;

signals:
    void ping();
};
```

以上是一个基本的信号定义，只需要声明即可，Qt 会通过 MOC，也即元对象系统帮我们自动生成代码。

信号的作用是在某个地方可以方便的触发信号关联的函数，也即触发槽函数。

槽函数的定义也非常简单，使用 `slots` 方法定义函数即可。

```cpp
#include <QDebug> // <- 为了能使用 qDebug() 进行输出

class Pong : public QObject {
    Q_OBJECT // <-- 不要忘记这里

public:
    Pong(QObject *parent = nullptr): QObject(parent) {}
    ~Pong() = default;

public slots:
    void pong() { qDebug() << "pong"; }
};
```
和信号函数不同的是，槽函数必须实现函数定义，槽函数可以看作是 C 语言项目中的回调函数。

这里为什么会增加了一个 public 呢，槽函数因为是响应函数，需要进行权限管控，否则通过信号调用的函数就违背了 C++ 的 OOP。

> 需要注意的是，Qt5 使用了模板进行信号和槽的绑定，允许我们使用函数指针的方式，所以在看到不一样的用法时，不必怀疑。

我们使用 QObject::connect 函数对信号和槽进行绑定，并使用 emit 关键字对信号进行触发，让我们把代码写到 main 函数里吧。

```cpp
#include <QCoreApplication>
#include <QTimer> // <- 信号的发送必须要等待 QCoreApplication 的事件循环启动

#include "ping.h"
#include "pong.h"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    auto ping = new Ping;
    auto pong = new Pong;

    // 写法1，函数指针的方式
    QObject::connect(ping, &Ping::ping, pong, &Pong::pong);

    //  写法2，旧方式，基于字符串的元对象信息查找
    QObject::connect(ping, signal(ping()), pong, slot(pong()));

    QTimer::singleShot(0, ping, &Ping::ping); // <- 在下一次事件队列执行
    QTimer::singleShot(1000, ping, [=] { // <- 在 1000 毫秒后执行
        emit ping->ping(); // <- 使用 emit 关键字触发信号
    });

    return a.exec();
}
```

> 需要注意的是，基于函数指针的方式，信号和槽函数的函数签名必须是匹配的，槽函数的参数可以小于信号的参数，多余的参数会被自动丢弃。

在上面的例子中，一共导入了两个新的头文件，一个是 QDebug，一个是 QTimer。

在普通 C++ 项目中，我们通常使用 iostream 进行输入输出，Qt 则提供了 QDebug 头文件，
在后续的文章中，会详细介绍 QDebug 的内容。

QTimer 是 Qt 提供的计时器，在上面的例子中，因为执行 exec 函数后将会阻塞，没办法手动发出信号，
所以使用计时器延后运行。

经过上面的示例代码，学过设计模式的人可能会立马意识到，这是观察者模式，即槽函数希望观察信号的发生。Qt 把细节全部封装了，只提供最简单的使用方法给开发者，通常我们意识不到在调用 connect 函数时，Qt 已经完成了订阅收集，我们只需要简单的使用 emit 发出信号，或者直接进行信号的调用，就可以完成触发。

## 属性

属性和普通的成员字段不一样，属性通常在编译期被修改为 getter 和 setter 的方法调用，属性比起普通的方法调用的形式更易于读写。

众所周知，C++ 是没有属性的，Qt 在 1991 年就发布了，当时的 C++ 还没有像现在一样有好用的语法，好用的标准库，这就导致 Qt 必须自己想办法提供功能，自己提供标准库，这也间接的导致了 Qt 成为了 platform。

Qt 定义属性是通过 `Q_PROPERTY` 宏定义的，该宏也仅仅是收集信息，而非代码生成，我们仍然需要一个成员，需要一个 getter 和 setter 函数，有时候还需要一个信号。

`Q_PROPERTY` 宏必须定义在 Q_OBJECT 的下方。

```cpp
#include <QString>
#include <QObject>

class Property : public QObject {
    Q_OBJECT // <- 不要忘了这个

    Q_PROPERTY(QString name MEMBER m_name READ name WRITE setName NOTIFY nameChanged) // <- 看这里

public:
    Property(QObject *parent = nullptr): QObject(parent) {}
    ~Property() = defulat;

    QString name() const { // <- getter
        return QString("Hello %1").arg(name);
    }

signals:
    void nameChanged(); // <- property changed signal

public slots:
    void setName(const QString& name) { // <- setter
        if (m_name != name) {
          m_name = name;
          emit nameChanged();
        }
    }

private:
    QString m_name;
};
```

一个基本的代码如上所示，通过 `Q_PROPERTY` 宏给对象定义一个属性，属性的类型是 QString，这是 Qt 封装的 string 类，MEMBER 指定成员的名称，READ 和 WRITE 是属性的 getter 和 setter，NOTIFY 指定变化的信号。

`Q_PROPERTY` 的定义还有很多，远不止上面提到的。

```cpp
Q_PROPERTY(type name
           (READ getFunction [WRITE setFunction] |
            MEMBER memberName [(READ getFunction | WRITE setFunction)])
           [RESET resetFunction]
           [NOTIFY notifySignal]
           [REVISION int | REVISION(int[, int])]
           [DESIGNABLE bool]
           [SCRIPTABLE bool]
           [STORED bool]
           [USER bool]
           [BINDABLE bindableProperty]
           [CONSTANT]
           [FINAL]
           [REQUIRED])
```

使用这套属性系统，已经帮助我们完成了属性的定义，如果我们没有提供 setter 函数，Qt 会帮我们自动生成，并且会自动触发 NOTIFY 信号，否则我们需要自行判断条件，在合适的时候发出变更信号。

现在属性已经定义好了，我们就要考虑用了，还是上面的 main 函数，加入我们的 Property 类。

```cpp
#include <QCoreApplication>
#include <QTimer> // <- 信号的发送必须要等待 QCoreApplication 的事件循环启动

#include "property.h"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    auto property = new Property;

    QObject::connect(property, &Property::nameChanged, property, [=] {
        qDebug() << property->property("name");
        qDebug() << property->name();
    });

    QTimer::singleShot(1000, property, [=] {
        property->setProperty("name", "lxz"); // <- 使用 setProperty 修改属性
        property->setName("lxz"); // <- 直接调用 setter 函数进行设置
    });

    return a.exec();
}
```

在代码中，我们使用 `property` 和 `setProperty` 方法读写属性，并使用信号进行状态变化监听。

可能看到这里小伙伴会有一个疑问，这看起来，我完全可以自己调用 setter 和 getter，绑定信号呀，为什么要用这一套呢？

问的好！~~洒家~~ 这就告诉你！

如果我把 getter 和 setter 都放在 private 里呢？是不是你只能通过 Qt 的函数进行读写访问了，甚至 Qt 帮我们实现了反射，我们可以遍历对象的属性进行读写调用，而不用关心具体的名称，这才是 `Q_PROPERTY` 为我们带来的实际价值。

在下一章，我会介绍 Qt 究竟是如何实现这一切的，带领大家了解 Qt 的秘密。

## 引用资料

本系列只希望当作一个领头羊，为的是解决新手没有合适的 Qt 入门教材，所以本系列只会涉及一些基础的内容，深入了解 Qt 还需要去看 Qt 的文档，甚至去查看 Qt 的源代码。

- [Qt Signals & Slots](https://doc.qt.io/qt-6/signalsandslots.html)
- [The Property System](https://doc.qt.io/qt-6/properties.html)
