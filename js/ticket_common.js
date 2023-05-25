$(function(){
    // 제출 시 정보 저장 //
        $(".ticket_form").on("submit",function(e){
            e.preventDefault();
            const bbb = new FormData(e.target);
            const ccc = Object.fromEntries(bbb.entries());
            const ddd = $(this).data("type");
            const submitTime = Date.now();
            ccc.type = ddd;
            ccc.submitTime = submitTime;
            console.log(submitTime)

            const getList = JSON.parse(localStorage.getItem("basket_list"));
            getList.push(ccc);
            localStorage.setItem("basket_list",JSON.stringify(getList));

            location.href = "/t_use_reser02.html";
        })
})