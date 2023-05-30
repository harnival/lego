$(function(){
     // 제출 시 정보 저장 //
     $(".ticket_form").on("submit",function(e){
        e.preventDefault();
        const bbb = new FormData(e.target);
        const ccc = Object.fromEntries(bbb.entries());
        const ddd = $(this).data("type");
            ccc["common.type"] = ddd;
        const eee = $(this).data("typetext");
            ccc["common.typetext"] = eee;
        const submitTime = Date.now();
            ccc["common.submittime"] = submitTime;
        if(ddd == 3 ||ddd == 4||ddd == 5) {
          const infoArr = [];
          $(".i_info").each(function(){
            const $e = {};
            $(this).find("input").each(function(){
              const u = $(this).prop("name");
              if(u) {
                $e[u]=$(this).val();
                delete ccc[u];
              }
            });
            infoArr.push($e);
          });
          ccc.info = infoArr;
        }


        const getList = JSON.parse(localStorage.getItem("ticketBasket"));
        getList.push(ccc);
        localStorage.setItem("ticketBasket",JSON.stringify(getList));

        location.href = "/t_use/t_use_reser02.html";
    })
})