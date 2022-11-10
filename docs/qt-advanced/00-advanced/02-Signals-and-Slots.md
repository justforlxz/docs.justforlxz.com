---
title: 信号和槽
---

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

## 引用资料

本系列只希望当作一个领头羊，为的是解决新手没有合适的 Qt 入门教材，所以本系列只会涉及一些基础的内容，深入了解 Qt 还需要去看 Qt 的文档，甚至去查看 Qt 的源代码。

- [Qt Signals & Slots](https://doc.qt.io/qt-6/signalsandslots.html)
