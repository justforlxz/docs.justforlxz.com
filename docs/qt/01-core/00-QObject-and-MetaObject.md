---
title: 'QObject 和 元对象'
---

## QObject

QObject 是所有 Qt class 的基类。

QObject 使用对象树管理自己及子对象，需要注意的是，这个子对象是逻辑上的父子关系，指的是对象管理，和 C++ 的继承没有关系。

当创建 QObject 对象时传递了 parent 参数，则 parent 会自动将当前 QObject 对象纳入子对象管理，我们可以使用 children 函数查看所有的子对象，也可以使用 findChild 或者 findChildren 来查找子对象。

除了在构造的时候可以传递 parent 参数，我们还可以调用 setParent 方法，为其设置父对象。

QObject 中最重要的是 metaObject，metaObject 包含了 QObject 的信息，例如 class 名称，属性，信号，槽。如果没有对象，也可以通过静态方法 staticMetaObject 获取到。

QObject 在销毁时会发出 `destroyed` 的信号，可以捕获该信号避免无效指针。

QObject 还可以使用事件过滤器，会在后面的 event 篇详细介绍。

### 线程亲和性

在 Qt 中，一个对象是具有线程亲和性的，也就是说对象在哪个线程上创建，就会一直在哪个线程上工作。

在创建 QObject 对象时，如果传递了 parent 参数，那么该对象会被移动到 parent 所在的线程。

当两个 QObject 对象不在同一个线程时，信号的触发将会发送到槽函数所处的对象的线程进行排队，无法直接触发。

默认情况下我们可以通过 thread 方法查询对象的线程关系，可以通过 `moveToThread` 方法将一个对象移动到新的线程。

> 需要注意的是，如果 QObject 没有线程关联，即 thread() 返回 nullptr，或者它正处于没有事件循环的线程中，那么它将无法触发信号和槽。

在 Qt 中，QObject 的线程是有要求的:

- 两个 QObject 不在同一个线程中，setParent() 将会失败
- 当一个 QObject 被移动到另一个线程时，它的所有子对象也会自动移动
- 如果 QObject 有父对象(parent())，moveToThread 将会失败

在一个常见的场景中，我们在编写一个多线程的程序，很多新手会使用继承 QThread，并重写 run 方法的方式编写，当我们在 run 方法中创建一个 QObject 对象，并使用 QThread 当作 parent 进行内存管理时，Qt 会警告我们对象并没有和 parent 在同一个线程。

```text
QObject: Cannot create children for a parent that is in a different thread.
(Parent is Thread(0x6000026c4250), parent's thread is QThread(0x6000026c4240), current thread is Thread(0x6000026c4250)
```

当我们打印 QThread 和新建的对象的 thread() 时，我们会发现他们的返回值确实不一样。这是因为 QThread 并不是实际的工作线程，它只是线程管理，run 方法是在一个新的线程工作，而 QObject 在创建的时候，和 parent 并不是同一个线程，所以 setParent 失败了。

想要避免这个问题，我们应该使用更加安全的 moveToThread，创建对象时不提供 parent，绑定好信号和槽后，使用 moveToThread 移动到新的线程，然后使用信号触发槽函数执行。

```cpp
#include <QCoreApplication>
#include <QThread>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QObject* worker = new QObject;

    // QObject::connect(); // <- 在这里绑定信号和槽

    QThread* workThread = new QThread;
    worker->moveToThread(workThread);
    workThread->start(); // <- 启动线程

    // emit worker->signal()  // <- 通过信号调用 worker 的工作函数

    return a.exec();
}
```

### 内存管理

QObject 使用对象树管理自己及子对象，在销毁时，QObject 会一层一层的进行销毁，每个 QObject 都会检查自己的子对象，直到所有子对象都完成销毁，自身也将被销毁。

QObject 有两种方式设置自己的父对象，一个方式是在构造时传入父对象的指针，另外一个方式是调用 setParent 方法设置。

> 需要注意的是，QObject 的对象树是可能存在回环的，发生回环时删除任何一个对象都会导致某个对象被两次释放，从而造成崩溃。
>
> 例如这个愚蠢的例子:
> ```cpp
> QObject *test1 = new QObject;
> QObject *test2 = new QObject(test1);
> QObject *test3 = new QObject(test2);
> test1->setParent(test3);
> test2->deleteLater();
> ```

### Q_OBJECT 宏

> 施工中...

### QMetaObject

> 施工中...
