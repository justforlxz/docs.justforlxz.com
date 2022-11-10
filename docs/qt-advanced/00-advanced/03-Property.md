---
title: 属性
---

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

- [The Property System](https://doc.qt.io/qt-6/properties.html)
