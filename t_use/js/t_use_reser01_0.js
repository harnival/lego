
$(function(){
    if(JSON.parse(localStorage.getItem("load"))) {
        let obj = JSON.parse(localStorage.getItem("load"));
        let num = obj["page"], char = obj["char"], name = obj["name"];
        $(".formBox").load(`/t_use/t_use_reser01_${num}.html`);
        $(".tapBox a").not(`:eq(${num-1})`).removeClass("active_tap");
        $(".tapBox a").eq(num-1).addClass("active_tap");
    } else {
      $(".formBox").load("/t_use/t_use_reser01_1.html");
    }
    $("header")
      .hide()
      .load("/header/header.html")
      .ready(function(){ $("header").show() })
    $("footer").load("/footer/footer.html");
      //localStorage setting
      localStorage.setItem("payment_list","[]");
      if ( !localStorage.getItem("ticketBasket") ) {
        localStorage.setItem("ticketBasket", "[]");
      }
      // page load
      $(document).on("DOMcontentLoaded",function(){
        const v = visualViewport.pageTop;
        console.log(v)
        $(window).scrollTop(v);
      })
      $(".tapBox_btn").each(function (i) {
        $(this).click(function () {
          $(".formBox").children().remove();
          $(".formBox").load(`/t_use/t_use_reser01_${i + 1}.html`);
          $(".tapBox a").not($(this)).removeClass("active_tap");
          $(this).addClass("active_tap");
        });
      });
      // basket setting
      const basketList = JSON.parse(localStorage.getItem("ticketBasket"));
      for( const key in basketList ) {
        const $listSetting = $("<li class='rb_l_list'></li>");
        const $closeBtn = $("<a href='#none' class='rb_remove'></a>");
        $closeBtn.click(function(){
          $(this).parent().remove();
    
          const getList = JSON.parse(localStorage.getItem("ticketBasket"));
          localStorage.setItem("ticketBasket",JSON.stringify(getList));
        });
        
        //불러오기
      }
});