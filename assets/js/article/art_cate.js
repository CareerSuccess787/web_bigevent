$(function() {
        initArtCateList()



        // 获取文章分类的列表(渲染)
        function initArtCateList() {
            $.ajax({
                method: 'GET',
                url: '/my/article/cates',
                success: function(res) {
                    var htmlStr = template('tpl-table', res)
                    $('tbody').html(htmlStr)
                }
            })
        }

        // 假设没有开启弹出层
        var indexAdd = null
            // 给添加类别按钮绑定点击事件
        $('#btnAddCate').on('click', function() {
            // 利用layUi.layer.open添加弹出层()
            // 有了弹出层以后赋值给indexAdd
            indexAdd = layui.layer.open({
                // 修改弹出层的‘层类型’为1
                type: 1,
                // 修改弹出层的宽高
                area: ['500px', '250px'],
                // 在content里通过DOM元素的添加渲染表格
                content: $('#dialog-add').html(),
                title: '添加文章分类'
            })

        })


        // 新增文章分类
        // 给动态表单添加提交事件，需要事件委托才能实现
        $('body').on('submit', '#form-add', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
                // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                // 快速获取表单数据
                data: $(this).serialize(),
                success: function(res) {
                    // 判断是否成功。不成功就提示；成功就获取列表 并渲染列表
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    initArtCateList()
                    layui.layer.msg('新增分类成功')
                        // 根据所因关闭对应的弹出层
                        // 通过layui提供的关闭层的方法layui.layer.close() 关闭弹出层,跟定时器很像
                    layui.layer.close(indexAdd)
                }

            })

        })


        // 通过代理形式，为form_edit表单绑定点击事件，弹出修改文章分类信息的层
        var indexEdit = null
        $('tbody').on('click', '#btn_edit', function() {
            indexEdit = layui.layer.open({
                // 修改弹出层的‘层类型’为1
                type: 1,
                // 修改弹出层的宽高
                area: ['500px', '250px'],
                // 在content里通过DOM元素的添加渲染表格
                content: $('#dialog-edit').html(),
                title: '修改文章分类'
            })

            // 通过模板引擎自定义的属性获取id
            var id = $(this).attr('data-id')

            // 发起ajax请求获取对应ID下的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    // 这个就是表单中的自定义属性lay-filter="form-edit"中的这个名字
                    layui.form.val('form-edit', res.data)
                }
            })
        })

        // 通过代理的形式，为修改分类的表单绑定submit事件
        $('body').on('submit', '#form-edit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault()

            // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    // 判断是否请求失败
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    // 成功以后提示成功、关闭弹出层、渲染页面数据
                    layui.layer.msg('修改成功')
                    layui.layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })

        // 代理方式给删除按钮添加点击事件
        $('tbody').on('click', '#btn_delete', function() {

            // 通过模板引擎自定义的属性获取id
            var id = $(this).attr('data-id')

            // 提示用户是否要删除
            layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
                // 确定删除就发起ajax请求
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        // 判断是否删除成功。失败提示，成功提示，关闭弹框，渲染页面
                        if (res.status !== 0) {
                            return layui.layer.msg(res.message)
                        }
                        layui.layer.msg('删除成功')
                        layui.layer.close(index);
                        initArtCateList()
                    }
                })
            })
        })







    }) //end