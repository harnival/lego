$(function() {
    $("footer").load("./footer/footer.html");
    $("header").load("./header/header.html");
    //load==================================
localStorage.removeItem("load");
//설명창 열기/닫기============================
$(".list_exp").each(function(){
    const $t = $(this);
    $(this).siblings("a").on("click",function(){
    $(this).siblings(".list_exp").css("display","flex");
    });
    $(this).find(".close_exp").on("click",function(){
    $(this).parents(".list_exp").css("display","none");
    });
    $(this).on("click",function(e){
    if( e.currentTarget == e.target) {
        $(this).css("display","none");
    }
    });
    $(document).on("keydown",function(e){
    if( $t.css("display") == "flex" && e.which == 27) {
        $t.css("display","none");
    }
    })
})
// 리스트 정리===============================
$(".list_ul").each(function(i){
    if( $(this).children("li").length%3 != 0) {
    const len = $(this).children("li").length % 3;
    for(let i=1; i<= 3-len; i++) {
        const $li = $("<li class='list_u_li_empty'></li>");
        $li.appendTo($(this))
    }
    }
})
//구매 페이지로 이동==========================
$(".gotoreser, .require_tc").each(function(){
    $(this).on("click",function(){
        const p = $(this).data("page") ,c = $(this).data("char") ,n = $(this).data("name");
        const obj = { page : p, char: c, name: n };
        localStorage.setItem("load", JSON.stringify(obj));
    })
})
});