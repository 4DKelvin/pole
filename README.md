Pole：前端开静态化解决方案
==========================
Pole是前端开发集成环境的一个组成部分，解决Web应用静态化开发调试的问题，将前后端工作解耦，使前端开发更加的专注在视图层。

在产品开发过程中，除纯静态单页Web应用之外，几乎都无法避免由页面动态化（将html转换成jsp或php）带来的一些问题：
* 本机前端开发环境复杂，至少需要部署两个开发环境，除前端环境之外，还额外需要一个动态环境，辅助jsp等动态页面开发调试；
* 对于开发者来说，前后端使用的模版不能通用，必须同时维护两套模版；
* 调试过程繁琐，尤其是在移动端开发，涉及到一些需要调用后端资源的功能，必须依赖后端环境才能完成调试；
* [GUI测试用例](http://baike.baidu.com/view/5131653.htm)难以维护，无法实现自动化GUI测试；

什么是静态化
------------
简单的说就是前端有一个静态开发环境，无需调用后端API获取数据，使用模拟数据开发者可以在静态环境下完成所有前端功能开发，将静态资源引用到动态环境后，动态环境获得与静态环境相同的功能和交互，后续也无需在动态环境下进行bug调试，在静态环境下同样能定位和还原bug。

静态化就是要创建一个这样的环境，解决前端开发和调试的问题。

为什么静态化
------------
推荐大家先阅读两篇檄文，虽然这两篇文章发布的时间比我启动Pole项目的时间稍晚，但文章描述的内容也是我正在思考的。
* [Web研发模式演变](https://github.com/lifesinger/lifesinger.github.com/issues/184)
* [前后端分离的思考与实践（一）](http://ued.taobao.org/blog/2014/04/full-stack-development-with-nodejs/#comment-12055)

对于Web开发来说，前后端一直是交织在一起的，尤其是在View与Controller两层上，无法避免这种开发模式产生的各种业务和沟通问题。
阿里系前端团队探索的是基于NodeJS的一种完全由前端掌控View与Controller的开发模式，技术架构复杂，前端面临的问题领域也从简单的View层扩展到View+Controller甚至Model层，为未来前端向全端的发展道路带了很多技术挑战。

Pole探索的是另一种更简单的开发模式——Web应用静态化，Pole并不希望改变现有的Web开发模式，而是使用静态化技术让Web应用可以在本机开发、调试和运行测试用例。这样做维持了前端开发面对的问题领域，同时也将前后端职责分得比较清晰。

Pole实现静态化
--------------
Pole不是独立存在的一个工具，只有将它融入到一个完整的前端开发集成环境中，才能真正发挥它的作用。Pole只是解决了Web应用静态化的问题，是开发者具备了在本机开发、调试和运行测试用例的能力。

实现Web应用静态化依赖Pole的两个能力：
* 使用[Pole Mock API](https://github.com/polejs/pole-mock)模拟后台数据接口实现纯静态化开发和调试；
* 使用Pole Compiler模块将静态HTML页面编译为后端可运行的JSP或PHP，实现前后端页面模版共享；

基于Pole的Web应用系统结构

![pole-structure](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/pole-structure.png)

使用Pole开发Web应用，仅需启动一个本地http服务，就能运行Web应用。如果Web应用是基于Grunt构建，那就更简单了，只需要依赖[grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)模块。

### [Pole Mock](https://github.com/polejs/pole-mock)
Pole Mock是一个JavaScript库，它由```PoleTag（html标签）```和```JavaScript API```两部分构成。

更多细节参见：[Pole Mock API](https://github.com/polejs/pole-mock)

### Pole Compiler
Pole Compiler是一个Node模块，它将```PoleTag```编译成目标动态页面标记。将Pole Compiler集成到[Grunt](http://gruntjs.com/)或[Glup](http://gulpjs.com/)这样的自动化构建工具之中，将极大的提高Pole的工作效率。

下面将详细描述如何[使用Pole Compiler](#%E4%BD%BF%E7%94%A8pole-compiler)。

### [Grunt Plugin](https://github.com/polejs/grunt-pole)
为了更好的发挥Pole的作用，需要将Pole集成到一个完整的前端开发集成环境中，Grunt就是一个很好的选择。Pole提供一个Grunt插件[grunt-pole](https://github.com/polejs/grunt-pole)，将Pole作为自动化构建的一部分，使```pole compile```命令可以在Grunt环境下运行。

Web应用静态化之后，GUI用例测试也变得简单，使用[PhantomJS](http://phantomjs.org/)或其他测试框架，针对静态Web应用编写GUI测试用例，并在静态环境下运行GUI测试用例。

Pole的简单示例
--------------
[pole-demo](https://github.com/polejs/pole-demo)是一个Pole的简单示例项目，使用Grunt构建，结合Pole实现Web应用的静态化，可以在纯静态环境下运行和开发，并使用Pole Compiler将静态HTML编译成JSP。

使用Pole Compiler
-----------------
使用Compiler之前，必须先确认Web应用已经使用[Pole Mock](https://github.com/polejs/pole-mock)并符合接口规范。

运行下面命令安装Pole Compiller：

```shell
npm install pole --save-dev
```

如果是Grunt环境，则安装[grunt-pole](https://github.com/polejs/grunt-pole)插件，运行命令：

```shell
npm install grunt-pole --save-dev
```

具体请参考[grunt-pole](https://github.com/polejs/grunt-pole)项目文档。

### 运行Pole Compiler
在工作目录下创建```pole.json```文件，如果是Grunt环境，则直接配置``Gruntfile.js```的task。

在命令行执行```pole compile```，将源文件编译成动态页面。

### Compile Options

#### mockConfig : String
指定```pole-mock-config.json```路径，有关```pole-mock-config.json```参见[Pole Mock](https://github.com/polejs/pole-mock)文档。

#### poleCoreFile : String
指定```pole-core.js```路径，```pole-core.js```可以在[Pole Mock](https://github.com/polejs/pole-mock)项目中获得。

运行```pole compile```之后，会生成两类文件，其中一个是```pole-release.js```，```pole-release.js```是将```pole-core.js```和模版打包在一起生成的JS文件，它最终会运行在正式项目中，用来替代开发环境中使用的```pole-mock.js```。

#### src : String/Array
指定将被编译的源文件路径，可以是一下几种格式：

```js
// 指定文件名
src: 'app/1.html'

// 指定文件数组
src: ['app/1.html', 'app/2.html']

// 匹配文件类型
src: ['app/*.html']

// 匹配文件类型，包含子目录文件
src: ['app/**/*.html']
```

#### dest : String
指定输出目录。

#### fragmentDir : String
指定碎片目录，有关```PoleFragmentTag```的用法参见[Pole Mock](https://github.com/polejs/pole-mock)项目文档。

#### target : String
指定编译目标语言，取值范围：'jsp'，目前仅支持JSP。

#### targetTemplate : String
指定目标语言页面模版，默认为编译工具自带模版。

#### targetTemplateSpecs : Object
指定特定HTML使用的页面模版，如：

```js
targetTemplateSpecs: {
    'app/grid.html': 'app/jsp_templates/grid.tpl',
    'app/infinite-scroll.html': 'app/jsp_templates/infinite-scroll.tpl'
}
```

### Usage Examples
参见[pole-demo](https://github.com/polejs/pole-demo)

```
{
    mockConfig: 'app/pole-mock-config.json',
    poleCoreFile:'app/assets/node_modules/pole-mock/pole-core.js',
    src: ['app/*.html'],
    dest: 'dest/',
    fragmentDir: 'app/fragments/',
    target: 'jsp',
    targetTemplate: 'app/jsp_templates/default.tpl',
    targetTemplateSpecs: {
        'app/grid.html': 'app/jsp_templates/grid.tpl',
        'app/infinite-scroll.html': 'app/jsp_templates/infinite-scroll.tpl'
    }
}
```

