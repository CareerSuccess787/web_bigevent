$(function() {
    // 定义时间美化的过滤器(template模板，defaults默认，imports进口，Format格式化,const常量)
    template.defaults.imports.dateFormat = function(date) {
        // 先new 一个 Date
        const dt = new Date(date)

        // 调用的时候必须把变量名放前面 才能格式化
        var y = dt.getFullYear()

        // 月份+1要注意。然后补零的函数是包裹的
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数(注意一下这里是9)
    function padZero(n) {
        return n < 9 ? '0' + n : n
    }

    // 定义一个查询的参数对象,在请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页面值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的函数(渲染)
    function initTable() {

        // 发起数据请求:判断是否成功,不成功提示.
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 使用模板引擎渲染数据:利用script标签定义列表数据的模板引擎（定义需要渲染的那部分结构）。
                // 再js中利用template函数调用模板引擎，将获取的值渲染到表格中
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法。total文章总数量
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 调用模板引擎渲染分为的可选项
                var str = template('tpl-cate', res)
                    // console.log(str);
                $('[name=cate_id]').html(str)

                // 因为我们的layui的js在自定义之上，所以他无法监听到这个渲染的代码。利用layui.form.render()方法让leiui侦听到这个函数

                layui.form.render() // render使处于某状态;
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        // 阻止表单的默认行为
        e.preventDefault()
            // 获取表单中选中的值
        var cateId = $('[name="cate_id"]').val()
        var cateState = $('[name="state"]').val()
            // 为查询参数独享，在q对象中对应的属性赋值
        q.cate_id = cateId
        q.state = cateState
            // 根据最新数据的筛选条件，重新渲染表格的数据
        initTable()
    })



    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页
        layui.laypage.render({
            elem: 'pageBox', //注意：这里不能加 # 号
            count: total, //数据总数。一般通过服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //起始页(默认哪页被选中）
            layout: ['count', 'prev', 'page', 'limit', 'next', 'skip'], // 指定分页都有啥
            limits: [2, 5, 10], // 指定显示多少条
            // 拿到切换以后的页码值
            // 分页发生切换的时候，触发jump回调函数
            // 触发jump回调的方式有两种
            // 1)点击页面切换的时候，就触发jump回调
            // 2）调用laypage.render()方法就触发jump回调函数
            //可以通过first的值，来判断是通过哪种方式， 触发的jump回调，
            // 如果first的值为true，证明是方式2触发的，否则就是方式1触发的
            jump: function(obj, first) {
                console.log(first + '： true是切换页面，undefined是点击页面') //方式1是true，方式2是undefined
                console.log(obj.curr);
                // 把最新的页码值给到q里的pagenum对象中
                q.pagenum = obj.curr
                    // 把最新的条目数赋值给q
                q.pagesize = obj.limit

                if (!first) { // 如果不是方式1，就调用函数
                    // 根据最新的q获取对应的数据列表，并渲染表格
                    initTable()
                }
                // 
            }
        })
    }


    // 通过代理的形式给删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        // 获取到文章的ID(在自定义模板中添加了自定义属性。)
        var id = $(this).attr('data-Id')

        // 询问用户是否要删除数据
        layui.layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {

            // 发起ajax删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg('删除成功')

                    // 数据删除完成后，判断当前也是否还有数据，如果没有剩余数据让页码数减一，再重新渲染
                    // 判断有几个删除按钮，输入按钮的个数等于一 ，说明删除了这条之后就没有任何数据了
                    if (len === 1) {
                        // 页码值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 渲染页面
                    initTable()
                    layui.layer.close(index);
                }
            })
        })
    })





})