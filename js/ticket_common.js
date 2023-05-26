$(function(){
    // 제출 시 정보 저장 //
        $(".ticket_form").on("submit",function(e){
            e.preventDefault();
            const bbb = new FormData(e.target);
            const ccc = Object.fromEntries(bbb.entries());
            const ddd = $(this).data("type");
            const eee = $(this).data("typetext");
            const submitTime = Date.now();
            ccc.type = ddd;
            ccc.typetext = eee;
            ccc.submitTime = submitTime;
            
            if(ddd==4) {
                let n=0;
                const fff = $(this).data("pass");
                for ( key in fff) {
                    n += fff[key];
                }
                ccc.pass = fff;
                ccc.length = n;
            }

            const getList = JSON.parse(localStorage.getItem("ticketBasket"));
            getList.push(ccc);
            localStorage.setItem("ticketBasket",JSON.stringify(getList));

            location.href = "/t_use_reser02.html";
        })
})