---
title: View
---

> 施工中...

在 Qt 中，当我们想要表达很多重复数据的时候，如果我们继续使用布局管理器，会导致界面使用的内存越来越大，并且也会消耗大量的计算资源去处理布局，所以 Qt 提供了 QListView、QTableView、QTreeView 等界面封装，并设计了一种 MVC 的工作方式来结偶界面和数据。本篇章会介绍这几个 View 的用法。

View 控件会根据子控件在界面中显示的位置来动态的创建和销毁，通过这种方式来控制始终只有一部分数据可以展示出来，这样就可以节省大量的内存。

## QAbstractItemView

QAbstractItemView 是所有 view 的基类，它继承自抽象的可滚动控件 QAbstractScrollArea，这使得所有的 View 都自带滚动效果。

在 QAbstractItemView 中封装了和QAbstractItemModel 和QAbstractItemDelegate 的交互，这三个抽象基类就是提供 MVC 最重要的三个类。

## QListView

QListView 是一个线性列表控件，它可以展示大量重复的列，从 QAbstractItemModel 的 data 函数获取数据，并使用 QAbstractItemDelegate 的 paint 函数进行界面绘制。

通常情况下我们可以使用默认的 QListView 对象，但有些情况下我们会继承 QListView，比如处理点击事件。

## QTableView

## QTreeView
