$(function(){

const oneday = 86400000;
const todayDate = new Date();
    // 가격 숫자 정리 //
function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}  
// ============================ 페이지 로드 =============================
    // 테마 페이지 로드 //
$(".ri_load_pirate").load("./t_hotel_reser01_p.html");
$(".ri_load_kingdom").load("./t_hotel_reser01_k.html");
$(".ri_load_friends").load("./t_hotel_reser01_f.html");
$(".ri_load_ninja").load("./t_hotel_reser01_n.html");
    // 달력 로드 //
$(".sr_date_calender").load("./unit/multi_calender_hotel_side.html");
if ( !localStorage.getItem("hotelBasket")) {
    localStorage.setItem("hotelBasket", JSON.stringify([]));
}
    // 객실 설명 로드 //
let priceExp;
fetch("./cs_price_text.txt")
    .then(res => res.text())
    .then(res => {
        priceExp = JSON.parse(res);
        console.log(priceExp)
    });
// ============================ 공통요소 ==============================
    // 수량 체크 버튼 //
$(".sr_numbers")
    .delegate(".decrease_btn",'click',function(e){
        if( $(this).siblings("input").val() > 0) {
            $(this).siblings("input").val((i,v) => +v-1);
        }
        $(this).siblings("input").trigger("change");
    })
    .delegate(".increase_btn",'click',function(e){
        if ( $(this).hasClass(["sr_n_adult","ar_n_child"])) {
            if ($(this).siblings("input").val() < 4) {
                $(this).siblings("input").val((i,v) => +v+1);
            }
        } else {
            if ($(this).siblings("input").val() < 3) {
                $(this).siblings("input").val((i,v) => +v+1);
            }
        }
        $(this).siblings("input").trigger("change");
    })
    // 객실 취소 버튼 //
    .delegate(".sr_deleteRoom",'click',function(e){
        const trLength = $(".sr_n_list").length;
        if (trLength > 1) {
            $(this).parents(".sr_n_list").remove();
            $(".sr_n_list").each(function(i){
                $(this).find(".sr_n_tdBtn").text(`객실 ${i+1}`);
            });
        }
    })
    // 객실 추가 //
$(".sr_addRoom").on("click",function(){
    const trLength = $(".sr_n_list").length;
    if (trLength <4) {
        $(".sr_n_list").eq(0).addClass("sr_n_list_origin");
        const $cloneTr = $(".sr_n_list_origin").clone(true);
        $cloneTr.removeClass("sr_n_list_origin");
        $cloneTr.find(".th .sr_n_tdBtn").text(`객실 ${trLength + 1}`);
        $cloneTr.find("input").each(function(){
            $(this)
            .prop("id", function(i,v){ return v + (trLength+1) })
            .val((i,v) => 0);
        })
        $(".sr_numbers .tbody").append($cloneTr);
    }
});
    // 요금 계산 //
    // data-theme [1 : pirate , 2 : kingdom , 3 : friends , 4 : ninja ]
    // data-room [1 : premium , 2 : disabled , 3 : park , 4 : corner , 5 : suite , 6 : deluxe]
const priceArray_premium = [340000, 320000, 320000, 320000, 320000, 380000, 520000];
const priceArray_park = priceArray_premium.map(x => x+50000);
const priceArray_corner = priceArray_premium.map(x => x+100000);
const priceArray_suite = priceArray_premium.map(x => x+200000);
const priceArray_deluxe = priceArray_premium.map(x => x+300000);
const A1 = [ [],priceArray_premium, priceArray_premium, priceArray_park, priceArray_corner, priceArray_suite, priceArray_deluxe];
    // 3. 할인코드 입력
$(".sr_c_list a").not(".sr_c_disabled").click(function(){
    if ( $(this).hasClass("sr_c_active")) {
        $(this).removeClass("sr_c_active");
        $(".ri_e_t_choice li").show();
        $("#sr_c_input").val((i,v) => "");
    } else {
        $(this).addClass("sr_c_active");
        $(".sr_c_list").find("a").not($(this)).removeClass("sr_c_active");
        $("#sr_c_input").val((i,v) => $(this).data("code"));

        const q = $(this).data("code");
        $(".ri_e_t_choice li").each(function(){
            if ($(this).data("code") == q) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
});
$("#sr_c_input").change(function(){
    const q = $(this).val();
    $(".sr_c_list a").each(function(i){
        if($(this).data("code")==q) {
            $(this).addClass("sr_c_active");
        } else {
            $(this).removeClass("sr_c_active");
        }
    })
})
$(".sr_c_disabled").on("click",function(){
    $(this).toggleClass("sr_c_disabled_active");
});

const h = $(".shortReservation").css("height");
$(".openBtn").on("click",function(){
    $(this).toggleClass("act");
    // $(".shortReservation").toggleClass("uup");
    if($(this).hasClass("act")) {
        $(".shortReservation").animate({
            height: "80px"
        },1000);
    } else {
        $(".shortReservation").animate({
            height: h
        },1000);
    }
})
// 검색정보 입력 후, 해당 객실 로드 ----------------------------------------
$(".shortReservation_wrap_up").on("submit",function(e){ 
    $(".ri_e_t_choice").show();
    $(".ri_e_t_choice_extra").children().remove();
    e.preventDefault();
    const d = new FormData(e.target);
    const c = Object.fromEntries(d.entries());
    
    const adultNumber = c["sr_n_adult"];
    const childNumber = c["sr_n_child"];
    const toddlerNumber = c["sr_n_toddler"];
    const checkinDate = new Date(c["checkin"]);
    const checkoutDate = new Date(c["checkout"]);

    // 1. 기본 객실 로드 //
    $(".ri_e_t_choice_default").each(function(){
        if ( $(".sr_c_active").length == 0 || $(".sr_c_default").hasClass("sr_c_active")) {
            const $par = $(this).parents(".ri_e_t_box");
            const t = $par.data("theme");
            const r = $par.data("room");
            let m = 0;
            for ( let j = checkinDate; j < checkoutDate; j += oneday) {
                const d = new Date(j).getDay();
                m += A1[r][d];
            }
            $(this).children(".default_li")
                .show()
                .find(".ri_e_t_c_price")
                    .data("price",m)
                    .text("￦" + comma(m));
            $(this).children(".defaultAnnual_li")
                .show()
                .find(".ri_e_t_c_price")
                    .data("price",m*0.9)
                    .text("￦" + comma(m*0.9));
        } else {
            $(".default_li, .defaultAnnual_li").hide();
        }
    });
    // 2. 장애인 친화 객실 로드 //


    if ( $(".sr_c_disabled").hasClass("sr_c_disabled_active")) {
        $(".ri_e_t_box").each(function(){
            if($(this).data("room") == 2) {
                $(this).show();
            } else {
                $(this).hide()
            }
        })
    } else {
        $("ri_e_t_box").show();
    }
    // 3. 파크 2일 이용권 로드 //
    $(".twodays_li").each(function(){
        if ( $(".sr_c_active").length == 0 || $(".sr_c_twodays").hasClass("sr_c_active")) {
            if ( checkoutDate - checkinDate <= oneday) {                        
                    $(this).show();
                    const q = checkinDate.getDay();
                    const w = checkoutDate.getDay();
                    const ticket = adultNumber * 60000 + childNumber * 50000;
                    $(".twodays_li").each(function(){
                        const par = $(this).parents(".ri_e_t_box").data("room");
                        $(this).find(".ri_e_t_c_price")
                        .data("price", A1[par][q] + ticket )
                        .text( "￦" + comma(A1[par][q] + ticket) );
                    });
            } else {
                $(this).hide();
            }
        } else {
            $(this).hide();
        }
    });

    const originLi = $(`
        <li>
            <div class="ri_e_t_choice_body">
                <strong><a href="#none"></a></strong>
                <a href="#none" class="ri_e_t_c_price"></a>
            </div>
            <div class="ri_e_t_choice_slide">
                <div class="cs_exp">
                    <div class="cs_e_title"></div>
                    <div class="cs_e_pre"></div>
                    <div class="cs_e_notice"></div>
                </div>
                <div class="cs_price"></div>
            </div>
        </li>                        
    `);
    
    $(".ri_e_t_choice_extra").each(function(){
        
        const r = $(this).parents(".ri_e_t_box").data("room");
        const t = $(this).parents(".ri_e_t_box").data("theme");
        // 4. 얼리버드 //
        if ( $(".sr_c_active").length == 0 || $(".sr_c_early").hasClass("sr_c_active")) {
            if ( checkinDate - todayDate > oneday*21 && 0<checkinDate.getDay() && checkinDate.getDay()<4 && 0<checkoutDate.getDay() && checkoutDate.getDay()<4) {
                if ( todayDate < new Date(2023,5,28) && checkoutDate < new Date(2023,6,19)) {
                    if ( (r == 1 || r == 3) &&  t != 3) {
                        let m = 0;
                        for ( let j = checkinDate; j < checkoutDate; j += oneday) {
                            const d = new Date(j).getDay();
                            m += A1[r][d];
                        }
                        const $earlyLi = originLi.clone(true);
                        $earlyLi
                            .data("code","early")
                            .addClass("early_li")
                            .appendTo($(this))
                        $earlyLi.find("strong a").text("얼리버드 조식 패키지")
                        $earlyLi.find(".ri_e_t_c_price")
                            .data("price", m*0.8)
                            .text("￦" + comma(m*0.8));

                        
                        const $earlyAnnualLi = originLi.clone(true);
                        $earlyAnnualLi
                            .data("code","early")
                            .addClass("earlyAnnual_li")
                            .data("annual",true)
                            .appendTo($(this))
                        $earlyAnnualLi.find("strong a").text("[연간회원권 할인]얼리버드 조식 패키지");
                        $earlyAnnualLi.find(".ri_e_t_c_price")
                            .data("price", m*0.8*0.9)
                            .text("￦" + comma(m*0.8*0.9));

                        if (  checkoutDate - checkinDate == oneday ) {
                            const ticket = adultNumber * 60000 + childNumber * 50000;
                            const $earlyTwoLi = originLi.clone(true);
                            $earlyTwoLi
                                .data("code","early")
                                .addClass("earlyTwo_li")
                                .appendTo($(this));
                            $earlyTwoLi.find("strong a").text("얼리버드 파크 2일 이용권 패키지");
                            $earlyTwoLi.find(".ri_e_t_c_price")
                                .data("price", m*0.8 + ticket)
                                .text("￦" + comma(m * 0.8 + ticket));
                        }
                        
                    }  
                }
            }
            
        } else {
            $(".early_li, .earlyAnnual_li, .earlyTwo_li").remove();
        }

        // 5. 어썸초이스 - 프리미엄 only 파크뷰는 연간회원권만 , 프렌즈 x //
        if ( $(".sr_c_active").length == 0 || $(".sr_c_awesome").hasClass("sr_c_active")) {
            if ( checkoutDate - checkinDate >= oneday*2) {
                if (checkoutDate < new Date(2023,11,31)) {
                    if ( t != 3 ) {
                        let m = 0;
                        for ( let j = checkinDate; j < checkoutDate; j += oneday) {
                            const d = new Date(j).getDay();
                            m += A1[r][d];
                        }
                        if( r == 1 ) {
                        const $awesomeLi = originLi.clone(true);
                        $awesomeLi
                                .data("code", "awesome")
                                .addClass("awesome_li")
                                .appendTo($(this));
                            $awesomeLi.find("strong a").text("어썸 초이스");
                            $awesomeLi.find(".ri_e_t_c_price")
                                .data("price",m*0.95)
                                .text("￦" + comma(m*0.95));
                        
                        const $awesomeAnnualLi = originLi.clone(true);
                        $awesomeAnnualLi
                                .data("code", "awesome")
                                .data("annual",true)
                                .addClass("awesomeAnnual_li")
                                .appendTo($(this));
                            $awesomeAnnualLi.find("strong a").text("[연간회원권 할인]어썸 초이스");
                            $awesomeAnnualLi.find(".ri_e_t_c_price")
                                .data("price", m*0.85)
                                .text("￦" + comma(m*0.85));
                        }
                        if ( r == 3 ) {
                            const $awesomeAnnualLi = originLi.clone(true);
                            $awesomeAnnualLi
                                .data("code", "awesome")
                                .data("annual",true)
                                .addClass("awesomeAnnual_li")
                                .appendTo($(this));
                            $awesomeAnnualLi.find("strong a").text("[연간회원권 할인]어썸 초이스");
                            $awesomeAnnualLi.find(".ri_e_t_c_price")
                                .data("price", m * 0.85)
                                .text("￦" + comma(m*0.85));
                        }
                        
                    }

                }
            }
        
            
        } else {
            $(".awesome_li, .awesomeAnnual_li").remove();
        }

        // 6. 프렌즈 이벤트 //
        if ($(".sr_c_friends").hasClass("sr_c_active")) {
            $(".roomInfo_wrap > div").not(".ri_load_friends").hide();
            $(".ri_load_friends").show();
        } else {
            $(".roominfo_wrap > div").show();
        }
        if ( t == 3 ) {
            const $sib = $(this).siblings(".ri_e_t_choice_fixed");
            if ( checkoutDate < new Date(2023,5,6)) {
                $sib.children("li").eq(0)
                    .removeClass("twodays_li")
                    .find("strong a").text("[NEW LEGO® 프렌즈 패키지]조식 및 파크 2일 이용권 패키지")
                $sib.children("li").eq(1)
                    .removeClass("default_li")
                    .find("strong a").text("[NEW LEGO® 프렌즈 패키지]조식 패키지")
                $sib.children("li").eq(2)
                    .removeClass("defaultAnnual_li")
                    .find("strong a").text("[NEW LEGO® 프렌즈 패키지] 연간회원권 할인 - 조식 패키지")
                $(".friends_li, .friendsAnnual_li, friendsTwo_li").each(function(){
                    const q = $(this).attr("class");
                    const w = priceExp[q];
                    ([".cs_e_title",".cs_e_pre",".cs_e_notice"]).forEach((v,i) => {
                        for( key in w ) {
                            const r = w[key];
                        }
                    })
                })
            }
        }

        // 7. 브릭스타틱 생일 이벤트 //
        if ( $(".sr_c_active").length == 0 || $(".sr_c_birthday").hasClass("sr_c_active")) {
            let m = 0;
            for ( let j = checkinDate; j < checkoutDate; j += oneday) {
                const d = new Date(j).getDay();
                m += A1[r][d];
            }
            if ( (r == 1 || r == 3) && (t != 3)) {
                if ( checkoutDate - checkinDate == oneday) {                        
                    const $birthdayLi = originLi.clone(true);
                    $birthdayLi
                        .data("code", "birthday")
                        .addClass("birthday_li")
                        .appendTo($(this));
                    $birthdayLi.find("strong a").text("레고랜드® 브릭타스틱 생일 패키지");
                    $birthdayLi.find(".ri_e_t_c_price").text("￦" + comma(m+100000));
                
                    const $birthdayAnnualLi = originLi.clone(true);
                    $birthdayAnnualLi
                        .data("code", "birthday")
                        .data("annual",true)
                        .addClass("birthdayAnnual_li")
                        .appendTo($(this));
                    $birthdayAnnualLi.find("strong a").text("[연간회원권 할인]레고랜드® 브릭타스틱 생일 패키지");
                    $birthdayAnnualLi.find(".ri_e_t_c_price").text("￦" + comma(m+90000));
                }
            }
            $(".birthday_li, .birthdayAnnual_li").each(function(){
                const q = $(this).attr("class");
                const w = priceExp[q];
                $(this).find(".cs_e_title").text(w[0]);
                $(this).find(".cs_e_pre").text(w[1]);
                $(this).find(".cs_e_notice").text(w[2]);
            })
        } else {
            $(".birthday_li, .birthdayAnnual_li").remove();
        }

        
    })
    $(".ri_e_t_choice").find("li").each(function(){
        const q = $(this).attr("class");
        const w = priceExp[q];
        w[0].forEach((v,i) => {
            if(i==0) {
                v = `<strong>${v}</strong>`
                $(this).find(".cs_e_title").append(v);
            } else {
                v = `<span>${v}</span>`
                $(this).find(".cs_e_title").append(v);
            }
        })
        w[1].forEach((v,i) => {
            if(i==0) {
                v = `<strong>${v}</strong>`
                $(this).find(".cs_e_pre").append(v);
            } else {
                v = `<span>${v}</span>`
                $(this).find(".cs_e_pre").append(v);
            }
        })
        w[2].forEach((v,i) => {
            if(i==0) {
                v = `<strong>${v}</strong>`
                $(this).find(".cs_e_notice").append(v);
            } else {
                v = `<span>${v}</span>`
                $(this).find(".cs_e_notice").append(v);
            }
        })
    })
       
        
    
});
// ========= 제출
$(".ri_e_t_c_price").each(function(){
    const g = $(this).siblings("strong").find("a").text();
    $(this).data("title",g);

    $(this).click(function(){
        $(".shortReservation_wrap")
            .trigger("submit")
            .submit(function(e){
                const d = new FormData(e.target);
                const c = Object.fromEntries(d.entries());
                let basketArray = JSON.parse(localStorage.getItem("hotelBasket"));
                    basketArray.push(JSON.stringify(c));
                    localStorage.setItem("hotelBasket", JSON.stringify(basketArray));
                
                
            });

    })
})
});

