---
title: 定义属性
---

属性是一种特殊一些的成员，它具备 setter 和 getter 函数，用来读写一个变量。

在 Qt 中，我们使用 `Q_PROPERTY` 宏帮助我们定义属性。

> C++ 不具备属性，所以 Qt 的这个行为只能算模拟。

```cpp
#include <QString>
#include <QObject>

class Property : public QObject {
    Q_OBJECT // <- 不要忘了这个

    Q_PROPERTY(QString name MEMBER m_name READ name WRITE setName NOTIFY nameChanged) // <- 看这里

    QString name() const { // <- getter
        return QString("Hello %1").arg(name);
    }

    void setName(const QString& name) { // <- setter
        if (m_name != name) {
          m_name = name;
          emit nameChanged();
        }
    }

public:
    Property(QObject *parent = nullptr): QObject(parent) {}
    ~Property() = defulat;

signals:
    void nameChanged(); // <- property changed signal

private:
    QString m_name; // <- 保存值的成员
};
```

这就是一个属性的简单例子，定义了一个 QString 类型的属性，属性的名称叫 name，拥有一个 setter 方法和 getter 方法，还拥有一个属性变化时的信号。

其中我们使用 MEMBER 标记了对应的成员变量，setter 方法和 getter 方法，以及信号不是必须的，如果我们没有写，Qt 会帮我们生成代码。

这里是一个例子，可以看属性的使用。

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
        qDebug() << property->name(); // 失败，该方法是 private
    });

    QTimer::singleShot(1000, property, [=] {
        property->setProperty("name", "lxz"); // <- 使用 setProperty 修改属性
        property->setName("lxz"); // <- 失败，该方法是 private
    });

    return a.exec();
}
```

在上面的例子中可以看到，使用 setProperty() 和 property() 可以对属性进行读写，

在未来的章节中，我们还会了解到更高级的方法，通过遍历对象来查找我们需要的属性。
