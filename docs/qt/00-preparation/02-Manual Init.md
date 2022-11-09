---
title: '手动新建项目'
---

前面我介绍了如何通过 Qt 开发者最常用的开发工具 Qt Creator 新建项目，但是有些开发者并不喜欢这个工具，他们喜欢使用其他的，例如 VS Code，vim，emacs 等，这种情况下就需要手动创建所需的文件了。

一个项目的目录结构并没有固定的，通常是从最顶层的管理文件开始，通过一些分类方法将文件整理起来。

```
CMakeLists.txt
src/
  CMakeLists.txt
  main.cpp
misc/
  CMakeLists.txt
  files/
docs/
  CMakeLists.txt
plugins/
  CMakeLists.txt
  demo1/
    CMakeLists.txt
```

上面是我个人比较推荐的一种管理方式，当然也可以根据自己的需求进行管理。

本次我们只关心 `src` 目录的内容，其他目录的内容可暂时忽略。

在顶层的 CMakeLists.txt 文件中，我们需要定义好项目的名称，编译器版本，导入 Qt 的依赖，并添加 src 目录作为子目录。

## 定义 CMake 最小版本

首先我们定义 cmake 的最小版本，用来确保我们用到的一些函数存在:

```cmake
cmake_minimum_required(VERSION 3.5)
```

## 定义项目名称

```cmake
project(helloworld VERSION 0.1 LANGUAGES CXX)
```

VERSION 和 LALANGUAGES 是 project 的参数，用来指定项目的版本和开发语言。

## 定义 Qt 的自动处理

例如 MOC 生成、UI 文件生成、QRC 资源文件生成等，Qt 是通过预处理的方式给 C++ 打补丁才提供的支持。

```cmake
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
```

## 定义自动导入当前目录

这个定义的作用是方便我们自动 include 文件，否则我们需要将用到的头文件添加到二进制构建中。

```cmake
set(CMAKE_INCLUDE_CURRENT_DIR ON)
```

## 定义 C++ 版本

这里我们选择目前 C++ 的最新标准 c++17，并且开启了版本强制要求，避免编译器允许我们使用版本不兼容的语法。

```cmake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
```

> 最新的 C++ 标准应该是 c++20，但是因为编译器仍然没有完全支持，可以认为 c++17 是目前可用的最新版本。

## 导入 Qt 的库

CMake 是一个跨平台的构建系统，所以对库的导入进行了抽象，我们可以通过简单的函数就将所需的依赖库导入到构建系统中，并且可以方便的使用。

```cmake
find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)
```

这里采用了 Qt5 和 Qt6 兼容的方式，按照顺序查找 Qt6 和 Qt5 是否包含 Widgets component，如果存在，则会导入 `QT_VERSION_MAJOR` 的变量，内容是正确的 Qt 版本，我们就可以使用对应的 Qt 版本。

## 添加 src 目录

CMake 是一个脚本系统，支持加载其他目录的 CMakeLists.txt 文件。

```cmake
add_subdirectory(src)
```

## 定义构建的二进制

在 src 目录的 CMakeLists.txt 中，定义一个变量将构建所需的文件保存起来，并传递给 CMake。

使用 set 函数定义一个变量，并添加 main.cpp。

```cmake
set(PROJECT_SOURCES
        main.cpp
)
```

使用 qt_add_executable 函数定义一个 target，在 CMake 中，target 的概念可能是一个可执行文件的构建，也可能是动态库或者静态库，也可能是某段要执行的命令。

```cmake
qt_add_executable(helloworld
    MANUAL_FINALIZATION
    ${PROJECT_SOURCES}
)
```

二进制的构建已经结束了，我们还需要设置一下链接库，否则我们无法使用 Qt。库的链接非常方便和直观，只需要使用 `target_link_libraries` 就可以为某个 target 增加链接。

```cmake
target_link_libraries(helloworld PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)
```

在 Qt6 中，Qt 建议我们使用一个函数对 target 进行修饰。

```cmake
if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(helloworld)
endif()
```

## 安装文件

通常这个步骤不必在现在就处理，二进制已经构建完成了，我们需要安装到系统的某个路径下就可以脱离开发工具使用，在 Unix 系的系统里，通常会安装在 /usr/bin/ 目录下。

CMake 会提供一个安装路径的 prefix，所以安装路径我们只需要写一个相对路径即可。

```cmake
install(TARGETS helloworld
    BUNDLE DESTINATION .
    LIBRARY DESTINATION bin)
```

## main.cpp

项目的配置已经完成了，作为手动创建项目的示例，main.cpp 的代码不会特别复杂，只简单的说一下一个基本的 Qt 项目必须的部分。

在 src/main.cpp 文件中，我们需要新建一个 main 函数，这是 C++ 要求的程序入口，在 main 函数中，我们需要初始化一个 QCoreApplication 对象作为 Qt 应用程序的入口。

在初始化 QCoreApplication 过后，我们需要使用它提供的 exec 方法阻塞函数运行，这里涉及到事件循环机制，会在接下来的内容详细分析，这里不展开了。

```cpp
#include <QCoreApplication>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    return a.exec();
}
```

## 最终文件

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.5)

project(helloworld VERSION 0.1 LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)

add_subdirectory(src)
```

### src/CMakeLists.txt

```cmake
set(PROJECT_SOURCES
        main.cpp
)

qt_add_executable(helloworld
    MANUAL_FINALIZATION
    ${PROJECT_SOURCES}
)

target_link_libraries(helloworld PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)

install(TARGETS helloworld
    BUNDLE DESTINATION .
    LIBRARY DESTINATION bin)

if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(helloworld)
endif()
```

### src/main.cpp

```cpp
#include <QCoreApplication>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    return a.exec();
}
```
