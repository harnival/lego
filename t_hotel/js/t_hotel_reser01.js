$(function(){

    $("header")
        .hide()
        .load("/header/header.html")
        .ready(function(){$("header").show()})
    $("footer").load("/footer/footer.html");

const oneday = 86400000;
const todayDate = new Date();
const week = ['일','월','화','수','목','금','토'];
// ============================ 페이지 로드 =============================
    // 테마 페이지 로드 //
$(".ri_load_pirate").load("/t_hotel/t_hotel_reser01_p.html");
$(".ri_load_kingdom").load("/t_hotel/t_hotel_reser01_k.html");
$(".ri_load_friends").load("/t_hotel/t_hotel_reser01_f.html");
$(".ri_load_ninja").load("/t_hotel/t_hotel_reser01_n.html");
    // 달력 로드 //
$(".sr_date_calender").load("/t_hotel/multi_calender_hotel_side.html");
    // 저장소 생성 //
if ( !localStorage.getItem("hotelBasket")) {
    localStorage.setItem("hotelBasket", JSON.stringify([]));
}
    // 객실 설명 로드 //
let priceExp;
fetch("/t_hotel/cs_price_text.txt").then(res => res.text()).then(res => { priceExp = JSON.parse(res) });
// ============================ 공통요소 ==============================
    // 가격 숫자 정리 //
function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}      
    // 수량 체크 버튼 //
$(".sr_numbers")
    .on('click',".decrease_btn",function(e){
        if( $(this).siblings("input").val() > 0) {
            $(this).siblings("input").val((i,v) => +v-1);
        }
        $(this).siblings("input").trigger("change");
    })
    .on('click',".increase_btn",function(e){
        if ( $(this).hasClass(["sr_n_adult","ar_n_child"])) {
            if ($(this).siblings("input").val() < 4) {
                $(this).siblings("input").val((i,v) => +v+1);
            }
        } else {
            if ($(this).siblings("input").val() < 3) {
                $(this).siblings("input").val((i,v) => +v+1);
            }
        }
        $(this).siblings("input")
            .trigger("change");
    })
    .on('click',".sr_deleteRoom",function(e){
        // 객실 취소 버튼 //
        const trLength = $(".sr_n_list").length;
        const idx = $(".sr_deleteRoom").index($(this));
        if (trLength > 1) {
            $(this).parents(".sr_n_list").remove();
            $(".sr_n_list").each(function(i){
                $(this).find(".sr_n_tdBtn").text(`객실 ${i+1}`);
                $(this).find("input").each(function(){
                    $(this)
                    .prop("id", `room${i+1}_${$(this).data("age")}`)
                    .prop("name", `room${i+1}_${$(this).data("age")}`)
                })
            });
            $(".hb_unit").eq(idx).remove();
            $(".hb_u_room").each(function(i){
                $(this).text(`객실 ${i+1}`);
            })
            
        }
    })
    // 객실 추가 //
const originTd = $(`
    <div class="sr_n_list">
        <div class="th">
            <a href="#none" class="sr_deleteRoom">취소</a>
            <strong class="sr_n_tdBtn">객실 1</strong>
        </div>
        <div class="td">
            <div class="numberCheck">
                <input type="number" data-age="adult" name="adult" class="sr_n_adult" id="sr_n_adult" value="0" max="3" disabled readonly/>
                <a href="#none" class="decrease_btn">수량 제외<img src="/image/t_hotel_reser02/minus.png" alt=""></a>
                <a href="#none" class="increase_btn">수량 추가<img src="/image/t_hotel_reser02/plus.png" alt=""></a>
            </div>
        </div>
        <div class="td">
            <div class="numberCheck">
                <input type="number" data-age="child" name="child" class="sr_n_child" id="sr_n_child" value="0" max="3" disabled readonly/>
                <a href="#none" class="decrease_btn">수량 제외<img src="/image/t_hotel_reser02/minus.png" alt=""></a>
                <a href="#none" class="increase_btn">수량 추가<img src="/image/t_hotel_reser02/plus.png" alt=""></a>
            </div>
        </div>
        <div class="td">
            <div class="numberCheck">
                <input type="number" data-age="toddler" name="toddler" class="sr_n_toddler" id="sr_n_toddler" value="0" max="2" disabled readonly/>
                <a href="#none" class="decrease_btn">수량 제외<img src="/image/t_hotel_reser02/minus.png" alt=""></a>
                <a href="#none" class="increase_btn">수량 추가<img src="/image/t_hotel_reser02/plus.png" alt=""></a>
            </div>
        </div>
    </div>
`);
function addroom(){
    const trLength = $(".sr_n_list").length;
    if (trLength <4) {
        
        const $cloneTr = originTd.clone(true);
        
        $cloneTr.find(".th .sr_n_tdBtn").text(`객실 ${trLength + 1}`);
        $cloneTr.find("input").each(function(){
            $(this)
            .prop("id", `room${trLength+1}_${$(this).data("age")}`)
            .prop("name", `room${trLength+1}_${$(this).data("age")}`)
            .val((i,v) => 0);
        })
        $(".sr_numbers .tbody").append($cloneTr);
    }
}
addroom();
$(".sr_addRoom").on("click",function(){
    addroom();
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
    // 할인코드 입력 //
$(".sr_c_list a").not(".sr_c_disabled").click(function(){
    if ( $(this).hasClass("sr_c_active")) {
        $(this).removeClass("sr_c_active");
        $("#sr_c_input").val((i,v) => "");
    } else {
        $(this).addClass("sr_c_active");
        $(".sr_c_list a").not($(this)).removeClass("sr_c_active");
        $("#sr_c_input").val((i,v) => $(this).data("code"));

        const q = $(this).data("code");
        $(".ri_e_t_choice li").each(function(){
            if ($(this).data("code") == q) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
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
    // 장애인 친화 객실 선택 //
$(".sr_c_disabled").on("click",function(){
    $(this).toggleClass("sr_c_disabled_active");
});
    // 검색 슬라이드 //
function changes() {
    let v0=0,v1=0,v2=0;
    const l = $(".sr_n_list").length;
    $(".sr_n_list").each(function(){
        v0 += +$(this).find("input").eq(0).val();
        v1 += +$(this).find("input").eq(1).val();
        v2 += +$(this).find("input").eq(2).val();
    });
    $(".tfoot .th div").text(l);
    $(".tfoot .td div").eq(0).text(v0);
    $(".tfoot .td div").eq(1).text(v1);
    $(".tfoot .td div").eq(2).text(v2);
}
const slideHeight = 430;
const slideUpHeight = "10vh";
$(".checkin span, .checkout span, #sr_c_input").on("click",function(){
    $(".sr_slideBtn .slideBtn").addClass("act");
    changes();
    $(".thead").css("display","flex");
    $(".tfoot").css("display","none");
    $(".shortReservation").stop().animate({height: slideHeight},300)
    $(".sr_searchBtn").stop().animate({height: slideHeight},300);
})
$(".sr_searchBtn button").on("click",function(){
    $(".sr_slideBtn .slideBtn").removeClass("act");
    changes()
    $(".thead").css("display","none");
    $(".tfoot").css("display","flex");
    $(".shortReservation").stop().animate({height: slideUpHeight},300);
    $(".sr_searchBtn").stop().animate({height: slideUpHeight},300);
})
$(".sr_slideBtn .slideBtn").on("click",function(){
    if ( $(this).hasClass("act")){
        $(".sr_slideBtn .slideBtn").toggleClass("act");
        changes()
        $(".thead").css("display","none");
        $(".tfoot").css("display","flex");
        $(".shortReservation").stop().animate({height: slideUpHeight},300);
        $(".sr_searchBtn").stop().animate({height: slideUpHeight},300);
    } else {
        $(".sr_slideBtn .slideBtn").toggleClass("act");
        changes();
        $(".thead").css("display","flex");
        $(".tfoot").css("display","none");
        $(".shortReservation").stop().animate({height: slideHeight},300)
        $(".sr_searchBtn").stop().animate({height: slideHeight},300);
    }
})
    // 장바구니 슬라이드 //
$(".hb_slideBtn .slideBtn").on("click",function(){
    if ( $(this).hasClass("act2")){
        $(".hb_slideBtn .slideBtn").toggleClass("act2");
        $(".hotelBasket").stop().animate({height: slideUpHeight},300);
    } else {
        const h1 = $(".hb_date").outerHeight(true);
        const h2 = $(".hb_rooms").outerHeight(true);
        const h3 = $(".hb_total").outerHeight(true);
        $(".hb_slideBtn .slideBtn").toggleClass("act2");
        $(".hotelBasket").stop().animate({height: h1+h2+h3},300)
    }
});
    // 해당 객실 로드 //
function loadRoom(index,obj){ 
    $(".ri_e_t_choice").show();
    $(".ri_e_t_choice_extra").children().remove();
    $(".cs_price").children().remove();

    const adultNumber = obj.adult[index];
    const childNumber = obj.little[index];
    const toddlerNumber = obj.toddler[index];
    const checkinDate = new Date(obj["checkin"]);
    const checkoutDate = new Date(obj["checkout"]);
    // 일별 가격 고지 //
    let m = {}, datam = [], roomm = {};
    for ( let dd = 1; dd <= 6; dd++) {
        const pricem = [];
        for ( let j = +checkinDate; j < +checkoutDate; j += oneday) {
            const q0 = new Date(j);
            const q1 = q0.getFullYear(), q2 = q0.getMonth(), q3 = q0.getDate(), q4 = q0.getDay();
            const dateText =`${q1.toString().slice(2,5)}년 ${q2 + 1}월 ${q3}일 (${week[q4]})`
            datam.push(dateText);
            pricem.push(A1[dd][q4]);
        }
        m[dd] = pricem.reduce((a,b) => a+b);
        roomm[dd] = pricem;
    }
    // 1. 기본 객실 로드 //
    $(".ri_e_t_choice_default").each(function(){
        if ( $(".sr_c_active").length == 0) {
            const $par = $(this).parents(".ri_e_t_box");
            const t = $par.data("theme");
            const r = $par.data("room");
            roomm[r].forEach((v,idx) => {
                const val = v;
                const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                $(this).find(".default_li .cs_price").append($span);
                $(this).find(".friends_li .cs_price").append($span);

                const val2 = v*0.9;
                const $span2 = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val2)}</span></div>`);
                $(this).find(".defaultAnnual_li .cs_price").append($span2);
                $(this).find(".friendsAnnual_li .cs_price").append($span2);
            });
            $(this).children(".default_li")
                .show()
                .find(".ri_e_t_c_price")
                .data("price",m[r])
                .text("￦" + comma(+m[r]));
            $(this).children(".defaultAnnual_li")
                .show()
                .find(".ri_e_t_c_price")
                    .data("price",m[r]*0.9)
                    .text("￦" + comma(+m[r]*0.9));
        
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
    $(".twodays_li, .friendsTwo_li").each(function(){
        if ( $(".sr_c_active").length == 0 ) {
            if ( checkoutDate - checkinDate <= oneday) {                        
                    $(this).show();
                    const q = checkinDate.getDay();
                    const w = checkoutDate.getDay();
                    const ticket = adultNumber * 60000 + childNumber * 50000;
                    
                    const r = $(this).parents(".ri_e_t_box").data("room");
                    roomm[r].forEach((v,idx) => {
                        console.log(idx)
                        const val = v + ticket;
                        const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                        $(this).find(".cs_price").append($span);
                        $(this).find(".cs_price").append($span);
                    });
                    $(this).find(".ri_e_t_c_price")
                        .data("price", A1[r][q] + ticket )
                        .text( "￦" + comma(A1[r][q] + ticket) );
            
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
                <a href="#none" class='ri_e_t_c_title'><strong></strong></a>
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
                        
                        const $earlyLi = originLi.clone(true);
                        $earlyLi
                            .data("code","early")
                            .addClass("early_li")
                            .appendTo($(this))
                        $earlyLi.find("a strong").text("얼리버드 조식 패키지")
                        $earlyLi.find(".ri_e_t_c_price")
                            .data("price", m[r]*0.8)
                            .text("￦" + comma(+m[r]*0.8));
                        roomm[r].forEach((v,idx) => {
                            const val = v*0.8;
                            const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                            $(this).find(".early_li .cs_price").append($span);
                        });
                        
                        const $earlyAnnualLi = originLi.clone(true);
                        $earlyAnnualLi
                            .data("code","early")
                            .addClass("earlyAnnual_li")
                            .data("annual",true)
                            .appendTo($(this))
                        $earlyAnnualLi.find("a strong").text("[연간회원권 할인]얼리버드 조식 패키지");
                        $earlyAnnualLi.find(".ri_e_t_c_price")
                            .data("price", m[r]*0.8*0.9)
                            .text("￦" + comma(+m[r]*0.8*0.9));
                        roomm[r].forEach((v,idx) => {
                            const val = v*0.8*0.9;
                            const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                            $(this).find(".earlyAnnual_li .cs_price").append($span);
                        });
                        if (  checkoutDate - checkinDate == oneday ) {
                            const ticket = adultNumber * 60000 + childNumber * 50000;
                            const $earlyTwoLi = originLi.clone(true);
                            $earlyTwoLi
                                .data("code","early")
                                .addClass("earlyTwo_li")
                                .appendTo($(this));
                            $earlyTwoLi.find("a strong").text("얼리버드 파크 2일 이용권 패키지");
                            $earlyTwoLi.find(".ri_e_t_c_price")
                                .data("price", m[r]*0.8 + ticket)
                                .text("￦" + comma(+m[r] * 0.8 + ticket));
                            roomm[r].forEach((v,idx) => {
                                const val = v + ticket;
                                const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                                $(this).find(".earlyTwo_li .cs_price").append($span);
                            });
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
                        
                        if( r == 1 ) {
                        const $awesomeLi = originLi.clone(true);
                        $awesomeLi
                                .data("code", "awesome")
                                .addClass("awesome_li")
                                .appendTo($(this));
                            $awesomeLi.find("a strong").text("어썸 초이스");
                            $awesomeLi.find(".ri_e_t_c_price")
                                .data("price",m[r]*0.95)
                                .text("￦" + comma(+m[r]*0.95));
                            roomm[r].forEach((v,idx) => {
                                const val = v*0.95;
                                const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                                $(this).find(".awesome_li .cs_price").append($span);
                            });
                        
                        const $awesomeAnnualLi = originLi.clone(true);
                        $awesomeAnnualLi
                                .data("code", "awesome")
                                .data("annual",true)
                                .addClass("awesomeAnnual_li")
                                .appendTo($(this));
                            $awesomeAnnualLi.find("a strong").text("[연간회원권 할인]어썸 초이스");
                            $awesomeAnnualLi.find(".ri_e_t_c_price")
                                .data("price", m[r]*0.85)
                                .text("￦" + comma(+m[r]*0.85));
                            roomm[r].forEach((v,idx) => {
                                const val = v*0.85;
                                const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                                $(this).find(".awesomeAnnual_li .cs_price").append($span);
                            });
    
                        }
                        if ( r == 3 ) {
                            const $awesomeAnnualLi = originLi.clone(true);
                            $awesomeAnnualLi
                                .data("code", "awesome")
                                .data("annual",true)
                                .addClass("awesomeAnnual_li")
                                .appendTo($(this));
                            $awesomeAnnualLi.find("a strong").text("[연간회원권 할인]어썸 초이스");
                            $awesomeAnnualLi.find(".ri_e_t_c_price")
                                .data("price", m[r] * 0.85)
                                .text("￦" + comma(+m[r]*0.85));
                            roomm[r].forEach((v,idx) => {
                                const val = v*0.85;
                                const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                                $(this).find(".awesomeAnnual_li .cs_price").append($span);
                            });
    
                        }
                        
                    }
                }
            }
        } else {
            $(".awesome_li, .awesomeAnnual_li").remove();
        }

        // 6. 프렌즈 이벤트 //
        if ( $(".sr_c_active").length == 0 || $(".sr_c_friends").hasClass("sr_c_active")) {
            if ( t == 3 ) {
                if ( checkoutDate < new Date(2023,5,6)) {
                    $(this).siblings("ul").hide();

                    const $friendsLi = originLi.clone(true);
                    $friendsLi
                        .data("code", "friends")
                        .addClass("friends_li")
                        .appendTo($(this));
                    $friendsLi.find("a strong").text("[NEW LEGO® 프렌즈 패키지]조식 패키지");
                    
                    const $friendsAnnualLi = originLi.clone(true);
                    $friendsAnnualLi
                        .data("code", "friendsAnnual")
                        .addClass("friendsAnnual_li")
                        .appendTo($(this));
                    $friendsAnnualLi.find("a strong").text("[NEW LEGO® 프렌즈 패키지] 연간회원권 할인 - 조식 패키지");
                    
                    const $friendsTwoLi = originLi.clone(true);
                    $friendsTwoLi
                        .data("code", "friendsTwo")
                        .addClass("friendsTwo_li")
                        .appendTo($(this));
                    $friendsTwoLi.find("a strong").text("[NEW LEGO® 프렌즈 패키지] 조식 및 파크 2일 이용권 패키지");    
                    
                    const $par = $(this).parents(".ri_e_t_box");
                    const t = $par.data("theme");
                    const r = $par.data("room");
                    
                    $(this).children(".friends_li").find(".ri_e_t_c_price")
                        .data("price",m[r])
                        .text("￦" + comma(+m[r]));
                    $(this).children(".friendsAnnual_li").find(".ri_e_t_c_price")
                        .data("price",m[r]*0.9)
                        .text("￦" + comma(+m[r]*0.9));
                } else {
                    $(".friends_li, .friendsAnnual_li, .friendsTwo_li").remove();
                    $(this).siblings("ul").show();
                }
            } else {
                $(".friends_li, .friendsAnnual_li, .friendsTwo_li").remove();
            }
        } else {
            $(".friends_li, .friendsAnnual_li, .friendsTwo_li").remove();
        }
        // 7. 브릭스타틱 생일 이벤트 //
        if ( $(".sr_c_active").length == 0 || $(".sr_c_birthday").hasClass("sr_c_active")) {
            
            if ( (r == 1 || r == 3) && (t != 3)) {
                if ( checkoutDate - checkinDate == oneday) {                        
                    const $birthdayLi = originLi.clone(true);
                    $birthdayLi
                        .data("code", "birthday")
                        .addClass("birthday_li")
                        .appendTo($(this));
                    $birthdayLi.find("a strong").text("레고랜드® 브릭타스틱 생일 패키지");
                    $birthdayLi.find(".ri_e_t_c_price").text("￦" + comma(+m[r]+100000));
                
                    const $birthdayAnnualLi = originLi.clone(true);
                    $birthdayAnnualLi
                        .data("code", "birthday")
                        .data("annual",true)
                        .addClass("birthdayAnnual_li")
                        .appendTo($(this));
                    $birthdayAnnualLi.find("a strong").text("[연간회원권 할인]레고랜드® 브릭타스틱 생일 패키지");
                    $birthdayAnnualLi.find(".ri_e_t_c_price").text("￦" + comma(+m[r]+90000));
                    roomm[r].forEach((v,idx) => {
                        const val = v+100000;
                        const val2 = v+90000;
                        const $span = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val)}</span></div>`);
                        const $span2 = $(`<div><span>${datam[idx]}</span><span>￦ ${comma(val2)}</span></div>`);
                        $(this).find(".birthday_li .cs_price").append($span);
                        $(this).find(".birthdayAnnual_li .cs_price").append($span2);
                    });

                }
            }
        } else {
            $(".birthday_li, .birthdayAnnual_li").remove();
        }
       
    })
    // 상세설명 입력 //
    $(".ri_e_t_choice li").each(function(){
        $(this).find(".cs_e_title, .cs_e_pre, .cs_e_notice").children().remove();
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
};
function makeUnit(data) {
    for (let i = 0; i< data.roomlength; i++) {
        const units = $(`
        <div class="hb_unit">
            <a href="#none">
                <strong class="hb_u_room">객실 ${i+1}</strong>
                <span class="hb_u_number">
                    어른 ${data.adult[i]}명, 어린이 ${data.little[i]}명, 유아 ${data.toddler[i]}명
                </span>
            </a>
            <div class="hb_u_detail">
                <span class="hb_u_theme"></span>
                <span class="hb_u_title"></span>
                <span class="hb_u_price"></span>
            </div>
            <div class="hb_u_input">
                <input type="hidden" name="room_theme${i+1}" class="room_theme" />
                <input type="hidden" name="room_title${i+1}" class="room_title" />
                <input type="hidden" name="room_price${i+1}" class="room_price" />
            </div>
        </div>
        `);
        $(".hb_rooms").append(units);
    }
}
$(document).on("click",".ri_e_t_c_title",function(){
    const $s = $(this).parent().siblings(".ri_e_t_choice_slide");
    $s.slideToggle();
    $(".ri_e_t_choice_slide").not($s).slideUp();
})
    // 구매목록 생성 //
let c;
$(".shortReservation_wrap_up").on("submit",function(event){
    event.preventDefault();
    // formdata 전달 //
    $(".hb_rooms").children().remove();
    const q = new FormData(event.target);
    c = Object.fromEntries(q.entries());
    console.log(c);
    const adt=[],ltl=[],tdl=[];
    $(".sr_n_list").each(function(i){
        const w = $(this).find("input");
        adt.push(w.get(0).value);
        ltl.push(w.get(1).value);
        tdl.push(w.get(2).value);
    });
    c["adult"] = adt;
    c["little"] = ltl;
    c["toddler"] = tdl;
    c["roomlength"] = $(".sr_n_list").length;
    $(".hb_d_rn_number").text(c["roomlength"]);
    
    // 장바구니 입력 //
    $(".hb_date_in").text($(".checkin span").text())
        .data("dt",c.checkin);
    $(".hb_date_out").text($(".checkout span").text())
        .data("dt",c.checkout);
    makeUnit(c);
    if ( !$(this).hasClass("act2")) {
        const h1 = $(".hb_date").outerHeight(true);
        const h2 = $(".hb_rooms").outerHeight(true);
        const h3 = $(".hb_total").outerHeight(true);
        $(".hb_slideBtn .slideBtn").toggleClass("act2");
        $(".hotelBasket").stop().animate({height: h1+h2+h3},300)
    }
    // 객실별 선택 //
    $(".hb_unit").eq(0).trigger("click");
});
$(".hb_rooms").on("click",".hb_unit",function(){
    $(this).toggleClass("select_hb_unit");
    $(".hb_unit").not($(this)).removeClass("select_hb_unit");
    
    const idx = $(".hb_unit").index($(this));
    loadRoom(idx,c);
});
    // 상품 선택 //
$(".roomInfo_wrap").on("click",".ri_e_t_c_price",function(){
    const p = $(this).text();
    const w = $(this).siblings("a").children("strong").text();
    const t = $(this).parents(".ri_e_t_box").find(".ri_e_t_exp_title").text();
    $(".select_hb_unit .hb_u_price")
        .text(p)
        .data("price", $(this).data("price"));
    $(".select_hb_unit .room_price").val((i,v) => $(this).data("price"))
    $(".select_hb_unit .hb_u_title")
        .text(w);
    $(".select_hb_unit .room_title").val((i,v) => w)
    $(".select_hb_unit .hb_u_theme")
        .text(t);
    $(".select_hb_unit .room_theme").val((i,v) => t)

    let r = 0;
    $(".hb_u_price").each(function(){
        console.log($(this).data("price"));
        if( $(this).data("price") ){
            r += Math.round($(this).data("price"));
        }
    });
    $(".hb_total_real span")
        .text("￦ "+ comma(r))
    $(".hb_total_tax span").text("￦ "+ comma(r*0.1)); 
    $(".hb_total_total span")
        .text("￦ "+ comma(r + r*0.1))
        .data("totalPrice",r+r*0.1);
});
$("#hb_rooms_form").on("submit",function(event){
    const q = new FormData(event.target);
    const w = Object.fromEntries(q.entries());
    const titleArr = [], themeArr = [], priceArr = [], newW = {};
    for ( key in w ) {
        if ( key.match(/title/g) ) {
            titleArr.push(w[key]);
        } else if ( key.match(/theme/g) ) {
            themeArr.push(w[key])
        } else if ( key.match(/price/g) ) {
            priceArr.push(+w[key])
        }
    }
    newW.title = titleArr;
    newW.theme = themeArr;
    newW.price = priceArr;
    newW.checkin = $(".hb_date_in").data("dt");
    newW.checkinText = $(".hb_date_in").text();
    newW.checkout = $(".hb_date_out").data("dt");
    newW.checkoutText = $(".hb_date_out").text();
    newW.submitTime = Date.now();
    const bsk = JSON.parse(localStorage.getItem("hotelBasket"));
    bsk.push(newW);
    localStorage.setItem("hotelBasket",JSON.stringify(bsk));

})

});

