(function(React, ReactRouter, $, Reflux, ReactDOM) {
// 定义图片数量
var BANNER_NUM = 2;
var ITEM_NUM = 33;
var textDOM = $('.loader-text span')
// 前端存储数据
var DATABASE = [];

// 第一步 创建消息
var TypeActions = Reflux.createActions(['changeType'])
// 第二步 定义store
var TypeStore = Reflux.createStore({
	// 监听消息对象
	listenables: [TypeActions],
	// 定义消息
	onChangeType: function(id) {
		// 从DATABASE中找到类型是id的数据
		var result = [];
		// 遍历数据
		DATABASE.forEach(function(obj, index) {
			// obj的type等于id
			if (obj.type === id) {
				// 缓存该成员
				result.push(obj)
			}
		})
		// 更新状态
		this.trigger(result)
		// console.log(this, arguments)
	}
})
// 定义action
var SearchAction = Reflux.createActions(['searchValue'])
// 定义store
var SearchStore = Reflux.createStore({
	// 监听action
	listenables: [SearchAction],
	// 监听消息
	onSearchValue: function(query) {
		// console.log(arguments)
		// 判断数据中每个成员是否包含query
		var result = [];
		// 遍历数据
		DATABASE.forEach(function(obj, index) {
			// 寻找obj包含query的成员
			// 遍历obj
			for (var i in obj) {
				// i属性名称， obj[i]属性值
				if (obj[i].indexOf(query) >= 0) {
					// 保存对象
					result.push(obj)
					// 防止多次存储
					return ;
				}
			}
		})
		// 更新状态
		this.trigger(result)
	}
})

// 定义混合
var RenderObj = {
	// 随机生成一个背景图片
	getBackgroundUrl: function() {
		return 'url(img/item/item' + parseInt(Math.random() * ITEM_NUM) + '.jpg)'
	},
	createList: function() {
		// 处理state中的数据
		return this.state.list.map(function(obj, index) {
			var styleObj = {
				backgroundImage: this.getBackgroundUrl()
			}
			return (
				<li key={index} style={styleObj}>
					<a href={obj.site}>
						<div className="content">
							<h2>{obj.name}</h2>
						</div>
						<div className="layer">
							{/*公司：{obj.company}会额外添加两个span。{'类型：' + obj.type}不会添加span*/}
							<p>{'公司：' + obj.company}</p>
							<p>{'类型：' + obj.type}</p>
							<p>{'描述：' + obj.description}</p>
						</div>
					</a>
				</li>
			)
		}.bind(this))
	}
}

// 定义组件
// 首页组件
var Home = React.createClass({
	// 使用混合
	mixins: [RenderObj],
	// 定义数据
	getInitialState: function() {
		return {
			list: DATABASE
		}
	},
	render: function() {
		return (
			<div className="section">
				<div className="container">
					<ul className="clearfix">{this.createList()}</ul>
				</div>
			</div>
		)
	}
})
// 分类页面组件
var Type = React.createClass({
	// 使用混合
	// 第三步 绑定store
	mixins: [RenderObj, Reflux.connect(TypeStore, 'list')],
	// 初始化状态
	getInitialState: function() {
		return {
			list: []
		}
	},
	render: function() {
		return (
			<div className="section">
				<div className="container">
					<ul className="clearfix">{this.createList()}</ul>
				</div>
			</div>
		)
	}
})
// 搜索页面组件
var Search = React.createClass({
	// 混合
	// 绑定store
	mixins: [RenderObj, Reflux.connect(SearchStore, 'list')],
	// 状态
	getInitialState: function() {
		return {
			list: []
		}
	},
	render: function() {
		return (
			<div className="section">
				<div className="container">
					<ul className="clearfix">{this.createList()}</ul>
				</div>
			</div>
		)
	}
})
// 定义banner组件
{/*<ReactRouter.Link to="/search/hello">search</ReactRouter.Link>
<ReactRouter.Link to="/type/movie">type</ReactRouter.Link>*/}
var Link = ReactRouter.Link;
var Banner = React.createClass({
	// 进入首页
	goHome: function() {
		// 更改hash就可以
		// location.hash = '#/'
		// 还可以通过路由更改
		ReactRouter.hashHistory.replace('/')
	},
	// 搜索方法
	goSearch: function(e) {
		// 判断enter键 
		if (e.keyCode === 13) {
			// 获取值
			// var val = e.target.value
			var val = this.refs.searchInput.value;
			// 大家实现约束性的
			// 校验合法性: 找到全是空白符的正则
			if (/^\s*$/.test(val)) {
				alert('请您输入内容！')
				// 不要再执行了
				return
			}
			// 合法，更新路由
			ReactRouter.hashHistory.replace('/search/' + val)
			// 情况输入框
			this.refs.searchInput.value = '';
		}
	},
	render: function() {
		return (
			<div className="header">
				<div className="header-top">
					<div className="container">
						<img onClick={this.goHome} src="img/logo.png" alt="" className="logo pull-left"/>
						<div className="search pull-right">
							{/*绑定事件驼峰式命名*/}
							<input ref="searchInput" onKeyUp={this.goSearch} type="text" className="form-control"/>
						</div>
						<ul className="nav nav-pills nav-justified">
							<li>
								<Link to="/type/movie">视频</Link>
							</li>
							<li>
								<Link to="/type/games">游戏</Link>
							</li>
							<li>
								<Link to="/type/news">新闻</Link>
							</li>
							<li>
								<Link to="/type/sports">体育</Link>
							</li>
							<li>
								<Link to="/type/buy">购物</Link>
							</li>
							<li>
								<Link to="/type/friends">社交</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="banner banner-1"></div>
			</div>
		)
	}
})
// 定义应用程序
var App = React.createClass({
	render: function() {
		return (
			<div>
				<Banner></Banner>
				{/*第一步 在应用程序中，定义渲染的位置*/}
				{this.props.children}
			</div>
		)
	},
	// 检测路由
	checkRoute: function() {
		// 如果是分类页面
		if (this.props.location.pathname.indexOf('/type/') === 0) {
			// 第四步 发送消息
			// 向分类组件发送消息
			TypeActions.changeType(this.props.params.id)
		// 判断搜索页面
		} else if (this.props.location.pathname.indexOf('/search/') === 0) {
			// 发送消息
			SearchAction.searchValue(this.props.params.query)
		}
	},
	// 组件创建完成，发送个消息吧
	componentDidMount: function() {
		// console.log(this)
		this.checkRoute();
	},
	// 存在期也要发送
	componentDidUpdate: function() {
		this.checkRoute();
	}
})
// 第二步 定义路由规则
// 缓存路由组件
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
// 定义路由规则
var routes = (
	<Router>
		<Route path="/" component={App}>
			<Route path="type/:id" component={Type}></Route>
			<Route path="search/:query" component={Search}></Route>
			{/*默认路由*/}
			<IndexRoute component={Home}></IndexRoute>
			{/*重定向
			<ReactRouter.Redirect path="ickt" to="search/ickt"></ReactRouter.Redirect>*/}
		</Route>
		<ReactRouter.Redirect path="*" to="/"></ReactRouter.Redirect>
	</Router>
)


/**
 * 定义加载库
 * @done 	加载完成执行的回调函数
 * @success 加载成功执行的回调函数
 * @fail 	加载失败执行的回调函数
 **/ 
function ImageLoader(done, success, fail) {
	// 定义默认参数
	this.done = done || function() {}
	this.success = success || function() {}
	this.fail = fail || function() {}
	// 初始化
	this.init()
}
// 定义原型方法
ImageLoader.prototype = {
	// 初始化数据
	init: function() {
		// 定义图片数量
		this.itemNum = ITEM_NUM;
		// 定义banner数量
		this.bannerNum = BANNER_NUM;
		// 定义总数
		this.total = this.itemNum + this.bannerNum;
		// 加载图片
		this.loadImage();
	},
	// 定义加载图片的方法
	loadImage: function() {
		// 加载banner图片
		// 复制banner图片总数。然后加载
		var num = this.bannerNum;
		while(--num >= 0) {
			this.loadImageItem(num, true)
		}
		// 复制图片总数，然后加载
		var num = this.itemNum;
		while(--num >= 0) {
			this.loadImageItem(num)
		}
	},
	/**
	 * 加载具体某一张图片的方法
	 * @num 		图片id
	 * @isBanner 	是否是banner图片
	 **/
	loadImageItem: function(num, isBanner) {
		// 创建图片加载器
		var img = new Image();
		// 加载成功时候的回调函数
		img.onload = function() {
			// 将图片总数减一
			this.total--
			// 每次都要执行success
			this.success(this.total, this.itemNum + this.bannerNum);
			// total为0 说明全局加载成功了
			if (this.total === 0) {
				this.done(this.total, this.itemNum + this.bannerNum)
			}
		}.bind(this)
		// 图片加载失败时候的回调函数
		img.onerror = function() {
			// 将图片总数减一
			this.total--;
			// 失败了执行fail
			this.fail(this.total, this.itemNum + this.bannerNum)
			// total为0，说明全部加载完成
			if (this.total === 0) {
				this.done(this.total, this.itemNum + this.bannerNum)
			}
		}.bind(this)
		// 加载图片
		img.src = this.getImageUrl(num, isBanner)
	},
	/**
	 * 获取图片完整路径的方法
	 * @num 		图片id
	 * @isBanner 	是否是banner图片
	 * return 		是图片地址
	 **/ 
	getImageUrl: function(num, isBanner) {
		// 是否是banner图片
		if (isBanner) {
			return 'img/banner/banner' + num + '.jpg';
		} else {
			return 'img/item/item' + num + '.jpg';
		}
	}
}

// 加载图片
new ImageLoader(function(current, total) {
	// current / totoal => 剩余图片占有的百分比
	// 加载了多少 就是 1 - current / totoal
	textDOM.html('100.00')
	// 请求数据，
	$.get('data/sites.json')
		.success(function(res) {
			// console.log('success', res)
			// 请求成功，将数据存储
			if (res && res.errno === 0) {
				DATABASE = res.data;
				// console.log(DATABASE)
				// 渲染组件
				// 第三步 渲染路由
				ReactDOM.render(routes, $('#app').get(0))
			}
		})
}, function(current, total) {
	// 修改加载进度
	textDOM.html(((1 - current / total) * 100).toFixed(2))
}, function(current, total) {
	// 修改加载进度
	textDOM.html(((1 - current / total) * 100).toFixed(2))
})

})(React, ReactRouter, jQuery, Reflux, ReactDOM)

