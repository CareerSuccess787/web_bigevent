$(function() {
    // 调取“获取用户基本信息”的函数
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        //    提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储中的token
            localStorage.removeItem('token')
                // 2.重新跳转到登录页面
            location.href = '/login.html'
            console.log(11);


            // 关闭confirm询问框（官方自带）
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // 要是有值就获取token 没有就给一个空值
        // localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。localStorage 属性是只读的。
        // 这行代码已经在baseAPI里了
        // headers: {
        // Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            console.log(res.message);
            // 调用'渲染用户的头像'的函数
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像：render[ˈran dər] 渲染 Avatar[ˈa və tao] 化身， 头像， 阿凡达
function renderAvatar(user) {

    // 1.获取用户的名称   
    var name = user.nickname || user.username // 这里用了'逻辑或': 1 真返1, 1 假返2。有一个真的就返回真的。有昵称就返回昵称，没有昵称就返回用户名

    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 3. 按需渲染用户的头像（ 有头像就渲染头像， 没有头像渲染文本头像）
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.tex-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()

        // 获取字符串中的第一个字符可以用'name[0]'这样。当数组用。.toUpperCase()将字母转成大写
        var first = name[0].toUpperCase();
        $('.tex-avatar').html(first).show()
    }
}