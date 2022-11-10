---
title: 事件循环
---

我觉得无法在跳过事件循环的情况下开展后续的内容，所以在这里插一章，专门解释一下。

在本系列中，消息循环，事件循环，本质上是在讲同一件事情，在 app 启动后，exec() 会不断的检查系统中是否发生了某些事情，比如用户是否通过外部设备(键盘、鼠标等)进行输入，或者是某个网络请求，也可能是程序内部产生的某个事情。

Qt 使用 QEvent 对消息进行封装，QEvent 中包含了要将事件发送到哪个对象上，QObject 可以通过 event() 和 eventFilter() 对事件进行过滤和查看，决定是否要继续分发给子对象。

如果 QObject 想要截获某个特定类型的事件，不分发给特定的对象，可以调用特定对象的 installEventFilter() 方法，安装事件过滤器，该方法接受一个 QObject 对象，这个 QObject 需要重写 eventFilter() 对消息和对象进行检查，根据返回值判断事件是否继续分发。

除了上面说到的几个函数，QObject 还有很多个和 event 相关的函数，例如 `childEvent`、`timerEvent`、`customEvent` 等，在后续的内容中可能会涉及到。

```cpp
class MainWindow : public QMainWindow
{
    Q_OBJECT
public:
    MainWindow();

protected:
    bool eventFilter(QObject *obj, QEvent *ev) override; // <- 重写这个方法

private:
    QTextEdit *textEdit;
};

MainWindow::MainWindow()
{
    textEdit = new QTextEdit;
    setCentralWidget(textEdit);

    textEdit->installEventFilter(this); // <- 想办法，给这小子来个意大利炮
}

bool MainWindow::eventFilter(QObject *obj, QEvent *event)
{
    if (obj == textEdit) { // <- 判断拦截的对象
        if (event->type() == QEvent::KeyPress) { // <- 判断拦截的事件
            QKeyEvent *keyEvent = static_cast<QKeyEvent*>(event);
            qDebug() << "Ate key press" << keyEvent->key();
            return true;
        } else {
            return false;
        }
    } else {
        // pass the event on to the parent class
        return QMainWindow::eventFilter(obj, event); // <- 对于不需要处理的对象，调用父类的函数继续处理
    }
}
```

上面讲了这么多，是因为 Qt 在图形软件开发中，事件是一个非常重要的概念，并且我们也会重写很多方法，插入我们的处理代码。
