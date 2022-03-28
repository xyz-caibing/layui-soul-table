$ = layui.$;
$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        complete: function (XMLHttpRequest, textStatus) {
            if (XMLHttpRequest.status == "499") {
                //$.alert("登录过期，请重新登录", function () {
                if (window.parent) {
                    window.parent.location.reload();
                } else {
                    window.location.reload();
                }
                //});
            } else if (XMLHttpRequest.status == "401") {
                //token过期，返回登录页面;
                window.location = '/logout';
            } else if (XMLHttpRequest.status == "500") {
                //$.alert("系统内部错误，请联系系统管理员");
            }
            $('.layui-table tr').each(function () {
                var data = $(this).find('td');
                for (var x in data) {
                    if (data[x].dataset != undefined && data[x].dataset.field != undefined && currencyCodeCollection.indexOf(data[x].dataset.field) !== -1) {
                        var reg = />(.+)</;
                        var value = reg.exec(data[x].innerHTML);
                        data[x].innerHTML = data[x].innerHTML.replace(value[1], formatMoney(value[1]));
                    }
                }
            })
        }
    });
    // $(document).ajaxSuccess(function (event, req, options) {
    //     $.validator.unobtrusive.parse(document); //验证
    // });
    //所有列表查询条件文本框前后做去空格处理
    $(".demoTable input").change(function () {
        $(this).val($(this).val().trim());
    });
    // $('.demoTable .layui-btn').on('click', function(){
    //     $(".demoTable input").each(function () {
    //         $(this).val($(this).val().trim());
    //     })
    // });
});
/*(function ($) {

    $.validator.setDefaults({
        showErrors: function () {
            var i, elements;
            if (this.errorList.length > 0) {
                var alertDanger = $(this.errorList[0].element).parents('form').find(".alert-danger");
                if (alertDanger.length > 0) {
                    alertDanger.show();
                }
            }
            for (i = 0; this.errorList[i]; i++) {
                var error = this.errorList[i];
                if (this.settings.highlight) {
                    this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                }
                this.showLabel(error.element, error.message);
            }
            if (this.errorList.length) {
                this.toShow = this.toShow.add(this.containers);
            }
            if (this.settings.success) {
                for (i = 0; this.successList[i]; i++) {
                    this.showLabel(this.successList[i]);
                }

                var alertDanger = $(this.successList[0]).parents('form').find(".alert-danger");
                if (alertDanger.length > 0) {
                    var error = alertDanger.find(".field-validation-error");
                    if (error.length == 0) {
                        alertDanger.hide();
                    }
                }
            }
            if (this.settings.unhighlight) {
                for (i = 0, elements = this.validElements() ; elements[i]; i++) {
                    this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                }
            }
            this.toHide = this.toHide.not(this.toShow);
            this.hideErrors();
            this.addWrapper(this.toShow).show();
        }
    });

}(jQuery));*/

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}


//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
}
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}
//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}

//所有列表时间查询校验
function checkTime(startTime, endTime) {
    var msg = '';
    if (startTime && endTime == '') {
        msg = '结束时间不能为空';
    }
    if (startTime == '' && endTime) {
        msg = '开始时间不能为空';
    }
    var startTime = new Date(startTime).getTime();
    var endTime = new Date(endTime).getTime();
    if (endTime < startTime) {
        msg = '结束时间不能小于开始时间';
    }
    return msg;
}

//校验必填项
function checkRequired(c = '') {
    var message = '';
    $(c + " input").each(function () {
        if ($(this)[0].required) {
            if ($(this).val() == '' || $(this).val() == null) {
                message = $(this).data("tip");
                return false;
            }
        }
    })
    if (message != '') {
        return message;
    }
    $(c + " select").each(function () {
        if ($(this)[0].required) {
            if ($(this).val() == '' || $(this).val() == null) {
                message = $(this).data("tip");
                return false;
            }
        }
    })
    return message;
}

//结算规则费用项校验
function checkIsAllEmpty(c = '') {
    var data = [];
    data.isAllEmpty = true;
    data.isAllInput = true;
    $(c + " input").each(function () {
        if ($(this).data("ignore") == 'y' && $(this).data("ignore") != undefined) {
        } else {
            if ($(this).val() != '' && $(this).val() != null) {
                data.isAllEmpty = false;
            }
            if ($(this).val() == '' || $(this).val() == null) {
                data.isAllInput = false;
            }
        }
    })
    $(c + " select").each(function () {
        if ($(this).data("ignore") == 'y' && $(this).data("ignore") != undefined) {
        } else {
            if ($(this).val() != '' && $(this).val() != null) {
                data.isAllEmpty = false;
            }
            if ($(this).val() == '' || $(this).val() == null) {
                data.isAllInput = false;
            }
        }

    })
    return data;
}

function formatMoney(num) {
    num = num.toString();
    var source = num.split(".");
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
    return source.join(".");
}

//检验文本框格式、字符长度
function vetify(c) {
    var message = '';
    $(c + " input").each(function () {
        if ($(this).data("type") == 'number') {
            //校验数字及长度
            if ($(this).val() == "" || isNaN($(this).val()) || eval($(this).val().length) > eval($(this).data("length"))) {
                message = $(this).data("tip");
                return false;
            }
        } else if ($(this).data("type") == 'varchar') {
            //校验长度
            if ($(this).val() == "" || eval($(this).val().length) > eval($(this).data("length"))) {
                message = $(this).data("tip");
                return false;
            }
        } else if ($(this).data("type") == 'plus') {//不包含0的正数
            var res = /^(\+)?\d+(\.\d+)?$/;
            if ($(this).val() != '') {
                if (!$(this).val().match(res) || !Number($(this).val())) {
                    message = $(this).data("tip");
                    return false;
                }
            }
        } else if ($(this).data("type") == 'int') {//正整数
            var reg = /^[1-9]\d*$/;
            if ($(this).val() && !$(this).val().match(reg)) {
                message = $(this).data("tip");
                return false;
            }
        }
    })
    return message;
}

//清空input、select值
function clearUp(c = '') {
    $(c + " input").each(function () {
        $(this).val('');
    })
    $(c + " select").each(function () {
        $(this).val('');
    })
    $(c + " textarea").each(function () {
        $(this).val('');
    })
}


function openPostWindow(url, data1, data2, data3 = '') {
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
    tempForm.target = "_blank"; //打开新页面
    var hideInput1 = document.createElement("input");
    hideInput1.type = "hidden";
    hideInput1.name = "data"; //后台要接受这个参数来取值
    hideInput1.value = data1; //后台实际取到的值
    var hideInput2 = document.createElement("input");
    hideInput2.type = "hidden";
    hideInput2.name = "head";
    hideInput2.value = data2;
    if (data3 != '') {
        var hideInput3 = document.createElement("input");
        hideInput3.type = "hidden";
        hideInput3.name = "total";
        hideInput3.value = data3;
        tempForm.appendChild(hideInput3);
    }
    tempForm.appendChild(hideInput1);
    tempForm.appendChild(hideInput2);

    if (document.all) {
        tempForm.attachEvent("onsubmit", function () {
        });        //IE
    } else {
        var subObj = tempForm.addEventListener("submit", function () {
        }, false);    //firefox
    }
    document.body.appendChild(tempForm);
    if (document.all) {
        tempForm.fireEvent("onsubmit");
    } else {
        tempForm.dispatchEvent(new Event("submit"));
    }
    tempForm.submit();
    document.body.removeChild(tempForm);
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
}
//减法函数，用来得到精确的减法结果
//说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
//调用：accSubtr(arg1,arg2)
//返回值：arg1减去arg2的精确结果
function accSubtr(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
//动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//给Number类型增加一个subtr 方法，调用起来更加方便。
Number.prototype.subtr = function (arg) {
    return accSubtr(arg, this);
};

function getLastDayOfCurrentMonth() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let d = new Date(year, month, 0);
    return d.getFullYear() + '-' + month + '-' + d.getDate()
}

function getBusinessType(type) {
    let typeSet = {
        1: '订单费用',
        2: '仓租费用',
        3: '退货费用',
        4: '增值服务费用明细',
        5: '异常服务费用明细',
        6: '其他收入',
        7: '发件',
        8: '退件',
        9: '海运散货',
        10: '海运整柜',
        11: '空运',
        12: '快递',
    };

    return typeSet[type] == undefined ? '' : typeSet[type];
}

function null2string(value) {
    return value == null ? '' : value;
}

function loginDetection(obj) {
    let url = obj.contentWindow.location.href;
    checkSysNotice();
    // noticePopup();
}

/**
 * 金额财会计数
 */
function moneyFormat(money) {
    if (money != undefined && money != null && money != '') {
        let tmpMoney = String(money);
        let decimalPart = tmpMoney.split('.')[1];
        let fixedLen = decimalPart?decimalPart.length:0;
        
        return BigNumber(money).toFormat(fixedLen);
    } else {
        return '';
    }
}

function checkSysNotice() {
    // $.ajaxSettings.headers = {'X-CSRF-TOKEN': token};
    $.post('/notice/unReadCount', {}, function (res) {
        if (res.code != 200) {
            // layer.msg(res.msg, {'icon': 5});
            console.log(res.msg);
            return false;
        }
        let d = res.data;
        updateSysNoticeCount(d.count);
    });

}

function updateSysNoticeCount(count = 0) {
    let elem = $('.nav-r #noticeDiv', window.parent.document);
    let element;
    if(count <= 0) {
        if($(elem).children('div').hasClass('layui-anim')) {
            $(elem).children('div').removeClass('layui-anim')
                .removeClass('layui-anim-fadein').removeClass('layui-anim-loop')
                .removeAttr('data-anim');
            $(elem).children('div').find('span').remove();
            $(elem).children('div').find('.layui-icon-add-1').remove();
        }
        return true;
    }
    elem.empty();
    if(count > 99) {
        element = $([
            '<div class="layui-anim layui-anim-fadein layui-anim-loop" data-anim="layui-anim-fadein layui-anim-loop" style="height: 40px;">',
            '<i class="notice layui-icon layui-icon-speaker"></i>',
            '<span style="font-size: 8px;position: relative;color: red;top: -8px;font-weight: 600;">99</span>',
            '<i class="layui-icon layui-icon-add-1" style="font-size: 8px; color: red;position: relative;color: red;top: -8px;left: -4px;"></i>',
            '</div>'
        ].join(''));
        elem.append(element);
        return true;
    }
    element = $([
            '<div class="layui-anim layui-anim-fadein layui-anim-loop" data-anim="layui-anim-fadein layui-anim-loop" style="height: 40px;">',
            '<i class="notice layui-icon layui-icon-speaker"></i>',
            '<span style="font-size: 8px;position: relative;color: red;top: -8px;font-weight: 600;">'+ count +'</span>',
            '</div>'
        ].join(''));

    elem.append(element);
    return true;
}

function noticePopup(token) {
    // $.ajaxSettings.headers = {'X-CSRF-TOKEN': token};
    $.post('/notice/popupedList', {}, function (res) {
        if (res.code != 200) {
            // layer.msg(res.msg, {'icon': 5, time: 50000});
            console.log(res.msg);
            return false;
        }
        let d = res.data;

        if(d.length <= 0) {
            return false;
        }
        sessionStorage.setItem('notice_pops', JSON.stringify(d));

        let noticeView = layer.open({
            type: 2,
            content: ['/notice/popup', 'no'],
            area: ["600px", "400px"],
            // btn: ['下一条'],
            closeBtn: 0,
            btnAlign: 'c',
            title: "消息内容",
            success: function (layout, index) {
            },
            btn1: function () {
                layer.closeAll();
            },
            end: function () {
            }
        });
        let iframe = window['layui-layer-iframe' + noticeView];
        if(iframe) {
            iframe.firstNotice = d[0];
            iframe._index = noticeView;
        }
    });
}

function simulationLinkDownFile(fileUrl, token) {
    
    let fileName = fileUrl.substring(fileUrl.lastIndexOf('/')+1);
    fetch(fileUrl, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        }),
    })
    .then(res => {
        if(res.status == 200) {
            return res.blob();
        }
        if(res.status == 404) {
            layer.msg('下载文件找不到...', {'icon': 5}, function(){
                // window.location.reload();
            });
        } else if(res.status == 401) {
            layer.msg('下载未经授权...', {'icon': 5}, function(){
                // window.location.reload();
            });
        } else {
            throw new Error(res.statusText);
        }
    })
    .catch(error => {
        console.error(error);
        layer.msg('下载失败...', {'icon': 5}, function(){
            // window.location.reload();
        });
    })
    .then(data => {
        if(!data) {
            return;
        }
        let blobUrl = window.URL.createObjectURL(data);
        let eleLink = document.createElement('a');
        eleLink.download = fileName;
        eleLink.href = blobUrl;
        eleLink.click();
    });
}

/**
 * 
 * @param {laypage} elemId 这里的 test1 是 ID，不用加 # 号
 * @param {laypage} laypage 
 * @param {curr} page 第几页
 * @param {limit} limit 页数
 * @param {count} total 总数 从服务端得到
 * @param {function} jump 回调
 */
function createEsPage(elemId, laypage, page, limit, total, jump) {
    laypage.render({
        elem: elemId 
        ,count: total
        ,prev: "上一页"
        ,groups: 1
        ,first: false
        ,last: false
        ,curr: page
        ,next: "下一页"
        ,limit: limit
        ,limits: [20, 50, 100, 1000]
        ,layout: ['prev', 'page', 'next', 'count', 'limit']
        ,jump: jump
    });
}
function createLayPage(elemId, laypage, page, limit, total, jump) {
    laypage.render({
        elem: elemId
        , count: total
        , prev: '<i class="layui-icon">&#xe603;</i>'
        , groups: 3
        // ,first: false
        // ,last: false
        , curr: page
        , next: '<i class="layui-icon">&#xe602;</i>'
        , limit: limit
        , limits: [20, 50, 100, 1000]
        , layout: ['prev', 'page', 'next', 'skip', 'count', 'limit']
        , jump: jump
    });
}

function createLayDateTimeRange(elemId, laydate, setDefaultNow = false, btns = ['clear', 'now', 'confirm']) {
    laydate.render({
        elem: '#' + elemId
        , type: 'datetime'
        , trigger: 'click'
        , range: '-'
        , format: 'yyyy-MM-dd HH:mm:ss'
        , btns: btns
        , done: function (value, startDate, endDate) {
            let elem = $(this)[0].elem;
            if(value == '') {
                elem.attr('start', '').attr('end', '');
            }else {
                let start = startDate.year + '-' + startDate.month + '-' + startDate.date + ' ' + startDate.hours + ':' + startDate.minutes + ':' + startDate.seconds;
                let end = endDate.year + '-' + endDate.month + '-' + endDate.date + ' ' + endDate.hours + ':' + endDate.minutes + ':' + endDate.seconds;
                elem.attr('start', start).attr('end', end);
            }
        }
    });
    if(setDefaultNow) {
        defaultNow(laydate, elemId, setDefaultNow);
    }
}

function createLayDate(elemId, laydate, opts={}, btns = ['clear', 'now', 'confirm']) {
    let configOpts = {
        elem: '#' + elemId
        , trigger: 'click'
        , format: 'yyyy-MM-dd'
        , btns: btns
        , done: function (value, date, endDate) {
            let elem = $(this)[0].elem;
            if(value == '') {
                elem.attr('format', '');
            }else {
                let formatDate = date.year + '' + date.month.toString().padStart(2, '0') + '' + date.date.toString().padStart(2, '0');
                elem.attr('format', formatDate);
            }
        }
    };
    if(opts.max != undefined) {
        configOpts.max = opts.max;
    }
    laydate.render(configOpts);
}

function createLayDateRange(elemId, laydate, setDefaultNow = false, btns = ['clear', 'now', 'confirm']) {
    if(laydate != null) {
        laydate.render({
            elem: '#' + elemId
            , type: 'date'
            , trigger: 'click'
            , range: '-'
            , format: 'yyyy-MM-dd'
            , btns: btns
            , done: function (value, startDate, endDate) {
                let elem = $(this)[0].elem;
                if(value == '') {
                    elem.attr('start', '').attr('end', '');
                }else {
                    let start = startDate.year + '-' + startDate.month + '-' + startDate.date;
                    let end = endDate.year + '-' + endDate.month + '-' + endDate.date;
                    elem.attr('start', start).attr('end', end);

                    if(setDefaultNow && setDefaultNow.start && setDefaultNow.end) {
                        let startHms = setDefaultNow.start.Hms || false;
                        let endHms = setDefaultNow.end.Hms || false;
                        if(startHms && endHms) {
                            start += ' ' + startHms;
                            end += ' ' + endHms;
                            elem.attr('start', start).attr('end', end)
                        }
                    }
                }
            }
        });
    }
    if(setDefaultNow) {
        defaultNow(laydate, elemId, setDefaultNow);
    }
}

function createLayMonthRange(elemId, laydate, setDefaultNow = false, btns = ['clear', 'now', 'confirm'], opts={}) {
    let configOpts = {
        elem: '#' + elemId
        , type: 'month'
        , trigger: 'click'
        , range: '-'
        , format: 'yyyy-MM'
        , btns: btns
        , done: function (value, startDate, endDate) {
            let elem = $(this)[0].elem;
            if(value == '') {
                elem.attr('start', '').attr('end', '');
            }else {
                let start = startDate.year + '-' + startDate.month.toString().padStart(2, '0');
                let end = endDate.year + '-' + endDate.month.toString().padStart(2, '0');
                elem.attr('start', start).attr('end', end);
            }
        }
    };
    if(opts.max != undefined) {
        configOpts.max = opts.max;
    }
    laydate.render(configOpts);
    if(setDefaultNow) {
        defaultNow(laydate, elemId, setDefaultNow);
    }
}

function createLayMonth(elemId, laydate, btns = ['clear', 'now', 'confirm']) {
    laydate.render({
        elem: '#' + elemId
        , type: 'month'
        , trigger: 'click'
        , format: 'yyyy-MM'
        , btns: btns
        , done: function (value, date, endDate) {
            let elem = $(this)[0].elem;
            if(value == '') {
                elem.attr('format', '');
            }else {
                let formatDate = date.year + '' + date.month.toString().padStart(2, '0');
                elem.attr('format', formatDate);
            }
        }
    });
}

function defaultNow(laydate, elemId, setDefaultNow) {
    
    let startYear, startMonth, startDay, endYear, endMonth, endDay, startHms, endHms;
    let date = new Date();

    let currMonth = Number(date.getMonth() + 1);
    if(setDefaultNow.start) {
        startYear = date.getFullYear().toString();
        startMonth = (currMonth + setDefaultNow.start.m);
        if(startMonth <= 0) {
            let yearNumStart = Math.ceil(Math.abs(setDefaultNow.start.m/12));
            startYear -= yearNumStart;
            startMonth = (12 * yearNumStart) + startMonth;
        }
        startDay = setDefaultNow.start.d;
        startHms = setDefaultNow.start.Hms || false;
    }else {//默认当月1号
        startMonth = currMonth;
        startDay = 1;
        startHms = setDefaultNow.start.Hms || false;
    }
    if(setDefaultNow.end) {
        endYear = date.getFullYear().toString();
        endMonth = (currMonth + setDefaultNow.end.m);
        if(endMonth <= 0) {
            let yearNumEnd = Math.ceil(Math.abs(setDefaultNow.end.m/12));
            endYear -= yearNumEnd;
            endMonth = (12 * yearNumEnd) + endMonth;
        }
        if(setDefaultNow.end.d == 0) {
            endDay = laydate.getEndDate(currMonth);
        }else{
            endDay = setDefaultNow.end.d;
        }
        endHms = setDefaultNow.end.Hms || false;
    }else {//默认当月今天
        endMonth = currMonth;
        endDay = date.getDate();
        endHms = setDefaultNow.end.Hms || false;
    }

    let start = startYear 
        + '-' + startMonth.toString().padStart(2, '0');
    let end = endYear 
        + '-' + endMonth.toString().padStart(2, '0');

    if(startDay && endDay) {
        start += '-' + startDay.toString().padStart(2, '0');
        end += '-' + endDay.toString().padStart(2, '0');
    }
    if(startDay && endDay && startHms && endHms) {
        start += ' ' + startHms;
        end += ' ' + endHms;
    }
    $('#' + elemId).attr('start', start).attr('end', end).val(start + ' - ' + end);
}

function getFixedCols(cols,  tableId) {
	if(tableId) {
        let cacheCols = layui.soulTable.getCurCols(tableId);
        if(cacheCols) {
            return cacheCols;
		}
	}
    let isFirstColFixed = false, unFixedCol = {operand:true};
    for (const key in cols[0]) {
        if (Object.hasOwnProperty.call(cols[0], key)) {
            const element = cols[0][key];
            if(element.checkbox == true) {
                element.fixed = 'left';
            } else if(element.type == 'numbers') {
                element.fixed = 'left';
            } else if(element.field != undefined && element.hide != true) {
                if(!isFirstColFixed) {
                    element.fixed = 'left';
                }
                isFirstColFixed = true;
            } else if(element.templet != undefined && element.title == '操作') {
                if(unFixedCol.operand) {
                    element.fixed = 'right';
                    // element.autoWidth = false;
                }
            }
        }
    }
    return cols;
}


/**
 * 处理输入框输入数值保留两位小数 支持负数
 * @param {string} currVal 
 * @returns string
 */
function inputNumberHandle(currVal = '') {
    // let currVal = $(el).val();
    if(currVal == '-') {
        return '-';
    }
    let pointCount = (currVal.split('.').length - 1);
    if(pointCount == 1 && currVal.substr(currVal.length-1,currVal.length) == '.') {
        // $(el).val(currVal.replace(/^([+-]?)(\d+)\.(\d\d).*$/, '$1$2.$3'));
        return currVal.replace(/^([+-]?)(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    // else if(pointCount == 2 && currVal.substr(currVal.length-1,currVal.length) == '.') {
    //     $(el).val(currVal.substr(0, currVal.length-1));
    //     return ;
    // }
    let valueBNObj = (new BigNumber(currVal));
    if(valueBNObj.isZero()) {
        // $(el).val(currVal.replace(/^([+-]?)(\d+)\.(\d\d).*$/, '$1$2.$3'));
        return currVal.replace(/^([+-]?)(\d+)\.(\d\d).*$/, '$1$2.$3');
    }
    if(valueBNObj.isNaN()) {
        return '';
    }
    let decimalPart = String(currVal).split('.')[1];
    decimals = decimalPart?decimalPart.length:0;

    let value = valueBNObj.toFixed(decimals);
    value = value.replace(/^([+-]?)(\d+)\.(\d\d).*$/, '$1$2.$3');
    // $(el).val(value);
    return value;
}

function openShowLogsView(layer, Type, data) {
    let showView = layer.open({
        id: 'ShowLogsView',
        type: 2,
        content: "/LOG/business/show?Type=" + Type,
        title: '查看日志',
        area: ["1000px", "72%"],//["1000px", "560px"],
        btn: ['关闭'],
        btnAlign: 'c',
        success: function (layero, index) {
        },
        btn1: function (index, layero) {
            layer.close(index);
            return false;
        },
        end: function () {
        }
    });
    let iframe = window['layui-layer-iframe' + showView];
    if(iframe) {
        iframe.rowData = data;
    }
}

function exportByDown(layer, url, params = {}, opts = {}) {
    let loadingIndex = layer.load(2);
    let labelName = opts.labelName;
    layer.open({
        title:'操作提示',
        type: 1,
        btnAlign: 'c',btn: ['确认', '取消'],
        area: ['500px', '200px'],
        yes: function(index, layero){
            $.post(url, params, function (d) {
                if (d.code != 200) {
                    layer.msg(d.msg, {'icon': 5});
                    return false;
                }
                // window.open(d.data, '_blank');
                simulationLinkDownFile(d.data.path, d.data._t);
            });
            layer.close(index);
            layer.close(loadingIndex);
        },
        btn2: function(index, layero){
            console.log('取消');
            layer.close(loadingIndex);
            layer.close(index);
        },
        cancel: function(index, layero){
            layer.close(loadingIndex);
            console.log('cancel');
            layer.close(index);
        },
        content: '<div style="text-align: center;">是否确认执行 '+labelName+' 操作</div>'
    });
}

function exportByCenter(layer, url, params = {}, opts = {}) {
    let loadingIndex = layer.load(2);
    let labelName = opts.labelName;
    layer.open({
        title:'操作提示',
        type: 1,
        btnAlign: 'c',btn: ['确认', '取消'],
        area: ['500px', '200px'],
        yes: function(index, layero){
            $.post(url, params, function (d) {
                if (d.code != 200) {
                    layer.msg(d.msg, {'icon': 5});
                    return false;
                }
                layer.open({
                    area: ['400px']
                    ,title: '数据导出'
                    ,content: '数据导出中，请前往导出中心查看下载！'
                    ,btn: ['查看']
                    ,yes: function(index, layero){
                        let queryStr = '?';
                        if(opts.orderType != undefined) {
                            queryStr = 'orderType=' + opts.orderType;
                        } else if(opts.TaskCode != undefined) {
                            queryStr = 'TaskCode=' + opts.TaskCode;
                        }
                        tabPage('/export/index' + queryStr, "{{ $menu_permission['_export_index']}}", "{{ $menu_permission['_export_index_name']}}");
                        layer.close(index);
                    }
                });
            });
            layer.close(index);
            layer.close(loadingIndex);
        },
        btn2: function(index, layero){
            console.log('取消');
            layer.close(loadingIndex);
            layer.close(index);
        },
        cancel: function(index, layero){
            layer.close(loadingIndex);
            console.log('cancel');
            layer.close(index);
        },
        content: '<div style="text-align: center;">是否确认执行 '+labelName+' 操作</div>'
    });
    
}

function importPanel(layer, url) {
    let element = $([
        '<div class="importResultModal" style="text-align: center; display:none;">',
            '<div class="layui-row">',
                '<div class="layui-col-md12">',
                '<label class="msg-label" style="color:red;"></label>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''));
    $(window.document).find('body').find('.importResultModal').remove();
    $(window.document).find('body').append(element);
    let uploadView = layer.open({
        type: 2,
        content: [url, 'no'],
        area: ["600px", "200px"],
        // btn: ['模板下载', '导入'],
        btnAlign: 'c',
        title: "导入",
        success: function (layero, index) {
            window[layero.find('iframe')[0]['name']].UploadResData = undefined;
        },
        cancel: function(index, layero){ 
            console.log('uploadView取消');
            layer.close(index);
        },
        end: function () {
            let res = iframe.UploadResData;
            if(!res) {
                return;
            }
            if(res.code == '404') {
                $('button[lay-event="import"]').click();
                layer.msg(res.msg, {'icon': 5});
                return;
            }
            if(res.code == '200') {
                layer.msg(res.msg, {'icon': 6});
                return;
            }
            let resView = layer.open({
                type: 1,
                content: element,
                area: ["600px", "200px"],
                btn: ['下载导入结果'],
                btnAlign: 'c',
                title: "导入",
                success: function (layout, index) {
                    element.find('.msg-label').text(res.data.info);
                },
                cancel: function(index, layero){
                    layer.close(index);
                    if(res) {
                        $('button[lay-event="import"]').click();
                    }
                },
                btn1: function (index, layero) {
                    window.open(res.data.path, '_blank');
                    layer.close(index);
                },
                end: function () {
                    iframe.UploadResData = undefined;
                }
            });
        }
    });
    let iframe = window['layui-layer-iframe' + uploadView];
    if(iframe) {
        iframe._index = uploadView;
    }
    
}

function confirmPanel(layer, labelName, cb) {
    let loadingIndex = layer.load(2);
    layer.open({
        title:'操作提示',
        type: 1,
        btnAlign: 'c',btn: ['确认', '取消'],
        area: ['500px', '200px'],
        yes: function(index, layero){
            if(typeof cb === 'function') {
                cb();
            }
            layer.close(index);
            layer.close(loadingIndex);
        },
        btn2: function(index, layero){
            console.log('取消');
            layer.close(loadingIndex);
            layer.close(index);
        },
        cancel: function(index, layero){
            layer.close(loadingIndex);
            console.log('cancel');
            layer.close(index);
        },
        content: '<div style="text-align: center;">是否确认执行 '+labelName+' 操作</div>'
    });
}

function createItsMerchantPermmisioSelects(formSelects, elems = [], xmSelects) {
    $.post('/ITS/common-info/getItsMerchantPermmision', {}, function (e) {
        if (e.code != 200) {
            layer.msg(e.msg, {'icon': 5});
            return false;
        }
        let selectedValue = [], contractEntityDropdownList= [];
        $.each(e.data, function (k, v) {
            selectedValue.push({name: '(' + v.SapCode + ')' + v.CustomerContractName, value: v.SapCode, oldName: v.CustomerContractName, currency: v.Currency});
            contractEntityDropdownList.push({Name: '(' + v.SapCode + ')' + v.CustomerContractName, Value: v.SapCode, oldName: v.CustomerContractName, currency: v.Currency});
        });
        if(formSelects) {
            $.each(elems, function(k, v){
                formSelects.data(v, 'local', {
                    arr: selectedValue
                });
            });
        }
        if(xmSelects) {
            xmSelects.update({data:contractEntityDropdownList});
        }
    });
}
function createContractEntityFormSelects(formSelects, elems = []) {
    $.post('/ITS/common/contract-entity/dropdown-list', {}, function (e) {
        if (e.code != 200) {
            layer.msg(e.msg, {'icon': 5});
            return false;
        }
        let contractEntityDropdownList = [];
        $.each(e.data, function (k, v) {
            contractEntityDropdownList.push({name: '(' + v.Value + ')' + v.Name, value: v.Value, oldName: v.Name});
        });
        $.each(elems, function(k, v){
            formSelects.data(v, 'local', {
                arr: contractEntityDropdownList
            });
        });
    });
}

function toolOperateConfirm(layer, url, params = {}, opts = {}, sCallback) {
    let loadingIndex = layer.load(2);
    let labelName = opts.labelName;
    layer.open({
        title:'操作提示',
        type: 1,
        btnAlign: 'c',btn: ['确认', '取消'],
        area: ['500px', '200px'],
        yes: function(index, layero){
            $.post(url, params, function (d) {
                if (d.code != 200) {
                    layer.msg(d.msg, {'icon': 5});
                    return false;
                }
                layer.msg('操作成功', {'icon': 6});
                if(typeof sCallback === 'function') {
                    sCallback();
                }
            });
            layer.close(index);
            layer.close(loadingIndex);
        },
        btn2: function(index, layero){
            console.log('取消');
            layer.close(loadingIndex);
            layer.close(index);
        },
        cancel: function(index, layero){
            layer.close(loadingIndex);
            console.log('cancel');
            layer.close(index);
        },
        content: '<div style="text-align: center;">是否确认执行 '+labelName+' 操作</div>'
    });
}

/**
 * TODO  待完善
 * @param {*} layer 
 * @param {*} url 
 * @param {*} selectedData 
 * @param {*} opts 
 * @param {*} sCallback 
 * @returns 
 */
function toolbarBtnConfirm(layer, url, selectedData = [], opts = {}, sCallback) {
    let loadingIndex = layer.load(2), isAllEnable = true;
    let labelName = opts.labelName;

    if(selectedData.length <= 0) {
        layer.close(loadingIndex);
        layer.msg('请勾选需要'+ labelName +'的数据', {'icon': 5});
        return false;
    }
    $.each(selectedData, function(k, v) {
        if(v.Status != opts.Status) {
            isAllEnable = false;
            return ;
        }
        selected.push(v.Id)
    });
    if(!isAllEnable) {
        layer.close(loadingIndex);
        layer.msg(opts.StatusHint, {'icon': 5});
        return false;
    }
    
    selected = selected.join(',');

    $.post(url, {Ids: selected}, function (e) {
        layer.close(loadingIndex);
        if (e.code != 200) {
            layer.msg(e.msg, {icon: 5});
            return false;
        }
        layer.msg('操作成功', {icon: 6});
        if(typeof sCallback === 'function') {
            sCallback();
        }
    });
}

function createXmSelect(elemId, opts, dCallback, onCallback) {
    let defOptions = {
        el: elemId,
        size: 'mini',
        radio: true,
        direction: 'auto',
        clickClose: true,
        filterable: true,
        autoRow: false,
        disabled: false,
        direction: 'down',
        theme: {color: '#0080ff'},
        prop:{name:'Name',value:'Value'},
        model: {label: {type: 'text'}},
        toolbar: {show: true, list: [ "ALL", "CLEAR", "REVERSE"]},
        data: function(){
            return [];
        },
        on: function(){}
    };
    if(opts.radio !== undefined) {
        defOptions.radio = opts.radio;
        if(opts.radio === true) {
            defOptions.toolbar = {show: true, list: ["CLEAR"]};
			defOptions.clickClose = true;
        } else {
            defOptions.clickClose = false;
        }
    }
    if(opts.autoRow !== undefined) {
        defOptions.autoRow = opts.autoRow;
    }
    if(opts.disabled !== undefined) {
        defOptions.disabled = opts.disabled;
    }
    if(opts.prop !== undefined) {
        defOptions.prop = opts.prop;
    }
    if(typeof dCallback == 'function') {
        defOptions.data = dCallback;
    }
    if(typeof onCallback == 'function') {
        defOptions.on = onCallback;
    }
    if(opts.template != undefined) {
        defOptions.template = opts.template;
    }
    if(opts.prop != undefined) {
        defOptions.prop = opts.prop;
    }
    if(opts.filterMethod != undefined) {
        defOptions.filterMethod = opts.filterMethod;
    }

    return xmSelect.render(defOptions);
}

function handleAjaxResponse(res) {
    let response = {};
    let tableData = !res.data.Data ? [] : res.data.Data,
        total = !res.data.Count ? 0 : res.data.Count,
        msg = res.msg,
        code = res.code,
        pageVal = !res.data.Count ? [] : res.data.SearchAfter;
        
    response.data = tableData;
    response.total = total;
    response.pageVal = pageVal;
    response.msg = msg;
    response.code = code;
    if(code != '200' && msg != '') {
        layer.msg(msg, {icon: 5});
    }
    return response;
}

function getTableConfig(Id, cols, data, doneFunc, DefHeight, Limit, operandFlexBar, DefaultToolbar=['filter'], Toolbar='toolbar') {
    let opts =  {
        elem: '#' + Id
        , id: Id
        , defaultToolbar: DefaultToolbar
        , toolbar: '#' + Toolbar
        , height: DefHeight
        , limit: Limit
        , page: false
        , data: data
        , operandFlexBar: operandFlexBar
    };
    if(cols) {
        opts.cols = getFixedCols(cols, Id);
    }
    if(typeof doneFunc == 'function') {
        opts.done = doneFunc;
    }
    return opts;
}
