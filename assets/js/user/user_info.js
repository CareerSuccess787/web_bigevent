$(function() {
        // 表单预校验
        // 从layui中获取form对象   
        var form = layui.form;

        // 从layui中获取提示框对象
        var layer = layui.layer;

        // 通过form.verify()方法来校验规则
        form.verify({
            nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }

                if (value.length > 6) {
                    return '昵称长度必须在1-6个字符之间！'
                }
            }
        })

        initUserInfo()



        // 初始化用户的基本信息
        function initUserInfo() {
            $.ajax({
                method: 'GET',
                url: '/my/userinfo',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    console.log(res);
                    // 调用form.val()快速为表单赋值
                    form.val('formUserInfo', res.data)


                }
            })
        }


        // 重置表单数据
        // 1.添加一个点击事件
        $('#btnReset').click(function(e) {
            // 2.阻止表单的默认重置行为
            e.preventDefault()

            // 3.调用初始化用户的基本信息函数。重置表单
            initUserInfo()
        })

        // 监听表单的提交事件
        $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
                // 发起ajax数据请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                // 快速拿到表单的数据
                data: $(this).serialize(),
                success: function(res) {
                    // 如果失败就提交提醒用户提交失败
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 如果成功，调用父页面中的方法，重新渲染用户头像和用户信息
                    window.parent.getUserInfo()
                    console.log(window.parent);
                }
            })
        })








    }) // end