---
title: 定义信号
---

在 Qt 中存在一种特殊的成员函数，他们在一个 signals 的块下，并且不需要实现函数定义，这是 Qt 的一种重要机制，称为 `信号`。

```cpp
class Ping : public QObject {
    Q_OBJECT // <-- 不要忘记这里

public:
    Ping(QObject *parent = nullptr): QObject(parent) {}
    ~Ping() = default;

signals: // <- 关键字
    void ping(); // <- 定义信号
};
```

这样我们就给对象定义了一个信号，信号的名称叫 ping。

在任何时候，对象都可以发出信号，只需要使用 `emit` 关键字，调用信号成员函数就可以了。

```cpp
Ping *ping = new Ping;
emit ping->ping(); // <- 发出信号
```

为什么 Qt 要加信号这个功能呢？

这是 Qt 提供的订阅机制的一部分，在下一章，我会介绍另一个概念: `槽`。
