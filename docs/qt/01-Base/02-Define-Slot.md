---
title: '定义槽'
---

在上一章中介绍了 Qt 的信号是如何定义的，这一章将会介绍一下什么是槽，以及槽如何定义。

槽函数是一类很普通的函数，它的作用是类似于回调函数，用来响应信号的，当一个对象的信号发出时，与其关联的槽就会被触发。

```cpp
#include <QDebug> // <- 为了能使用 qDebug() 进行输出

class Pong : public QObject {
    Q_OBJECT // <-- 不要忘记这里

public:
    Pong(QObject *parent = nullptr): QObject(parent) {}
    ~Pong() = default;

public slots: // <- 同样拥有一个关键字
    void pong() {
        qDebug() << "pong";
    }
};
```

使用 slots 就可以定义槽，可以发现槽就是一个普通的函数，和普通的成员函数不用的是，它有一个 `slots` 的关键字，这个关键字是 Qt 用来收集函数信息的，我们可以通过字面量去查找槽函数，目前我们并不需要了解这些。

既然已经定义好了槽函数，那么我们就需要将槽和信号关联起来，这里我们会使用到 QObject 提供的 connect() 方法，可以将二者进行关联。

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

connect() 有两种不同的用法，我个人提倡使用函数指针的形式，可以利用编译器进行参数匹配检查。

这里使用 QTimer 是因为信号的发送和槽的响应需要消息循环，但是应用的消息循环此时还未开始，所以需要延迟一下。

通常信号的发送是因为在未来某个时刻，发生了特定的事情才会触发，使用信号和槽可以帮助我们减少到处传递回调函数的烦恼，是 Qt 的一个重要功能。

现在相信你已经掌握了信号和槽的基本用法了，接下来我们开始攻克 `属性`。
