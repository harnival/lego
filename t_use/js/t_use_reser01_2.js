        $(function(){
          // for Total Price ----------
          var discountRate = 1;
          var dtf03_number = 0, dtf03_price = 0;
          var df04_price = [0,0,0];
          var df05_price = 0;

          function comma(x) {
              return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          //------------Load-------------
          const today = new Date();
          const weekArr = ["일", "월", "화", "수", "목", "금", "토"];
          let $selYear = today.getFullYear();
          let $selMonth = today.getMonth() +1;
            const $selMonthText = $selMonth < 10? "0"+($selMonth) : $selMonth;
          let $selDate = today.getDate();
            const $selDateText = $selDate < 10? "0"+$selDate : $selDate;
          let $selDay = today.getDay();
          $("#dated_date_value")
            .val((i,v) => `${$selYear}-${$selMonthText}-${$selDateText}`)
            .data("value",`${$selYear}${$selMonthText}${$selDateText}`);
          $(".date_inputs label").text(`${$selYear}년 ${$selMonth}월 ${$selDate}일 (${weekArr[$selDay]})`);
          
          if ( !$(".calender_table_cell").eq($selDay + $selDate-1).hasClass("disabled_cell") ) {
            $(".calender_table_cell").eq($selDay + $selDate-1).children().addClass("active_cell");
            $(".p_s_date").text(`${$selYear}년 ${$selMonth}월 ${$selDate}일 (${weekArr[$selDay]})`);
          }
          //---------------------------- 01. 달력 생성 & 날짜 입력
          $.fn.extend({
            week : function() {
              for (let i = 0; i < 7; i++) {
                const newDay = $("<div></div>");
                newDay.addClass("weekCell");
                $(this).find(".cdt_week").append(newDay);
                newDay.text(weekArr[i]);
              }
            },
            calender: function(years,months){
              if ( months < 0) {
                years -= 1;
                months = 11;
              } else if (months > 11) {
                years += 1;
                months = 0;
              }
              let monthStart = new Date(years, months, 1);
              let monthEnd = new Date(years, months + 1, 0);
              $(this).find(".cm_sb_span1").eq(0).text(years);
              $(this).find(".cm_sb_span1").eq(1).text(months+1);

              $(this).find(".cdt_date").children().remove();
              const i = monthStart.getDay() + monthEnd.getDate();

              for (let j = 1; j <= i; j++) {
                const n = j - monthStart.getDay();
                const cur = new Date(years,months,n);
                if (n > 0) {
                  if ( new Date(years, months, n) < today ) {
                    const disabled_cell = $("<div class='disabled_cell dataCell'></div>");
                    disabled_cell.text(n);
                    $(this).find(".cdt_date").append(disabled_cell);
                  }
                  else if ( cur >= new Date(2023,10,20) && new Date(2024,0,1) > cur && ([1,2,3]).some(e => e == cur.getDay()) ){
                    //휴장일
                    const disabled_cell = $("<div class='disabled_cell dataCell'></div>");
                    const exp = $("<span class='notOpen'>휴관</span>")
                    disabled_cell
                      .text(n)
                      .append(exp);
                    $(this).find(".cdt_date").append(disabled_cell);
                  }
                  else {
                    const able_cell = $("<a href='#none' class='able_cell dataCell'></a>");
                    able_cell.text(n);
                    able_cell.data(
                      "value",
                      `${years}${months + 1 < 10 ?  "0" + (months + 1) : months + 1 }${n < 10 ? "0"+n : n}`
                    ).prop(
                      "id",
                      `${years}-${months + 1 < 10 ? "0" + (months + 1) : months + 1 }-${n < 10 ? "0"+n : n}`
                    );
                    if ( able_cell.data("value") == $("#dated_date_value").data("value") ) {
                      able_cell.addClass("active_cell");
                    }
                    $(this).find(".cdt_date").append(able_cell);
                  }
                } else {
                  const newDateBox = $("<div class='dataCell'></div>");
                  $(this).find(".cdt_date").append(newDateBox);
                } 
              }
            }
          });
          
          $(".calender_wrap_prev").week();
          $(".calender_wrap").week();
          $(".calender_wrap_next").week();
          $(".calender_wrap_prev").calender($selYear,$selMonth-2);
          $(".calender_wrap").calender($selYear,$selMonth-1);
          $(".calender_wrap_next").calender($selYear,$selMonth);

            $(".calender_month .gotoback").click(function(){
              if (!($selYear == today.getFullYear() && $selMonth-1 == today.getMonth())) {
                if ( $selMonth == 1 ) {
                  $selMonth = 12;
                  $selYear -= 1;
                } else {
                  $selMonth -= 1;
                }
              }
              $(".calender_wrap_prev").calender($selYear,$selMonth-2);
              $(".calender_wrap").calender($selYear,$selMonth-1);
              $(".calender_wrap_next").calender($selYear,$selMonth);
            });
            $(".calender_month .gotonext").click(function(){
              if ( $selMonth == 12 ) {
                $selMonth = 1;
                $selYear += 1;
              } else {
                $selMonth += 1;
              }
              $(".calender_wrap_prev").calender($selYear,$selMonth-2);
              $(".calender_wrap").calender($selYear,$selMonth-1);
              $(".calender_wrap_next").calender($selYear,$selMonth);
            });

          $(".daytime_fieldset01").on("click",".able_cell",function(){
            $(this).addClass("active_cell");
            $(".able_cell").not($(this)).removeClass("active_cell");
            $("#daytime_date_value")
              .val((i,v) => $(this).prop("id"))
              .data("value",$(this).data("value"));
            const q = new Date($(this).prop("id"));
            $(".date_inputs label").text(`${q.getFullYear()} 년 ${q.getMonth()+1} 월 ${q.getDate()} 일 (${weekArr[q.getDay()]})`);
            $(".p_s_date").text(`${q.getFullYear()} 년 ${q.getMonth()+1} 월 ${q.getDate()} 일 (${weekArr[q.getDay()]})`);
          })    
          // -------------------------------------- 02. 인원 선택
          $(".decrease_btn").click(function(e){
            if( $(this).siblings("input").val() > 0) {
              $(this).siblings("input").val((i,v) => +v-1);
              $(this).siblings("input").trigger("change");           
            }
          })
          $(".increase_btn").click(function(e){
            $(this).siblings("input").val((i,v) => +v+1);
            $(this).siblings("input").trigger("change");
          });

          $("#daytime_numbers_grown").change(function(){
            $(".p_s_person").children("span:first-child").text(`대인 ${$(this).val()} 명`);
            total()
          })
          $("#daytime_numbers_little").change(function(){
            $(".p_s_person").children("span:last-child").text(`소인 ${$(this).val()} 명`);
            total()
          })
          
          // ------------------------------------- 03. 사전 구매
          $(".dtf03_wrap input:radio").each(function(i){
            $(".dtf03_wrap .nc_wrap input").eq(i).change(function(){
              $(".dtf03_wrap input:radio").eq(i).trigger("click");
            })

            $(this).click(function(){
              $(".dtf03_wrap .nc_wrap input").not(":eq("+i+")").prop("disabled",true);
              $(".dtf03_wrap .nc_wrap input").eq(i).prop("disabled",false);

              if ($(".dtf03_wrap .nc_wrap input").eq(i).val() == 0) {
                $(".p_s_extra >div").eq(0).hide()
              } else {
                $(".p_s_extra >div").eq(0).show()
              }
              if ( i == 0 ) {
                const digitalPhotoPrice = 25000;
                dtf03_number = $("#daytime_digital_photo_number").val();
                dtf03_price = digitalPhotoPrice;
                $(".p_s_e_title03").eq(0).text("디지털 기념 사진 사전구매");
                $(".p_s_e_number03").eq(0).text($("#daytime_digital_photo_number").val());
                $(".p_s_e_price03").eq(0).text("￦" + $("#daytime_digital_photo_number").val()*digitalPhotoPrice);
              }
              if ( i == 1 ) {
                const miniFigurePrice = 15000;
                dtf03_number = $("#daytime_mini_figure_number").val();
                dtf03_price = miniFigurePrice;
                $(".p_s_e_title03").eq(0).text("미니 피겨 사전구매");
                $(".p_s_e_number03").eq(0).text($("#daytime_mini_figure_number").val());
                $(".p_s_e_price03").eq(0).text("￦" + $("#daytime_mini_figure_number").val()*miniFigurePrice);
              }
              
              total()
            });
          });
          // ------------------------------------- 04. 패스트트랙
          
          // ------------------------------------- 05. VIP EXPERIENCES

          // ------------------------------------- 06-1. 할인적용
          if ($(".d_list").has(".empty_li")) {
            $(".p_s_discount").parent().remove();
          }
          $(".d_list li").each(function(i){
            $(this).find(".d_l_listopen").click(function(){
              $(".d_l_detail").eq(i).slideToggle();
              $(".d_l_detail").not(":eq("+i+")").slideUp()
              $(".d_l_w_exp").eq(i).slideToggle();
              $(".d_l_w_exp").not(":eq("+i+")").slideDown();
            })
          });

          const holiday = [
            { month: 1, date: 1}, // 신정
            { month: 3, date: 1}, // 삼일절
            { month: 5, date: 5}, // 어린이날
            { month: 6, date: 6}, // 현충일
            { month: 8, date: 15}, // 광복절
            { month: 10, date: 3}, // 개천절
            { month: 10, date: 9}, // 한글날
            { month: 12, date: 25} // 성탄절
          ]                        // 기타 음력 공휴일/ 대체휴일은 직접 입력 (설날, 추석, 석가탄신일)

          $(".d_l_select").each(function(i){
            $(this).click(function(){
              $(".d_list li").eq(i).toggleClass("active_discount");
              $(".d_list li").not(`:eq(${i})`).removeClass("active_discount");
              // $(".d_list li").eq(i).removeClass("not_discount");
              // $(".d_list li").not(`:eq(${i})`).addClass("not_discount");
              $(".d_list li input:checkbox").eq(i).prop("checked",function(){
                $(".d_list li input:checkbox").not($(this)).prop("checked",false);
                return !$(this).prop("checked");
              });

              if ( $(".d_list li input:checkbox").eq(i).is(":checked")) {
                $(".p_s_discount > div").show();
                const selectDate = new Date($selYear, $selMonth-1, $selDate);
                const selectDay = selectDate.getDay();
                const holidayCheck = holiday.some(function(v){
                  return v.month == $selMonth && v.date == $selDate;
                });

              } else if (!$(".d_list li input:checkbox").is(":checked")) {
                $(".p_s_discount > div").hide();
              } 
              total();
            });
          });
          // ------------------------------------- 06-2. 가격 합산          
          const total = function() {
            const grownDatedPrice = 
              today.getFullYear()==$selYear && today.getMonth()==$selMonth-1 && today.getDate()==$selDate ? 60000 : 54000;
            const littleDatedPrice = 
              today.getFullYear()==$selYear && today.getMonth()==$selMonth-1 && today.getDate()==$selDate ? 50000 : 45000;
            const t_1 = grownDatedPrice * $("#daytime_numbers_grown").val() + littleDatedPrice * $("#daytime_numbers_little").val();
            const t_2 = dtf03_number * dtf03_price;
            // const t_3 = df04_price.reduce((a,b) => a+b, 0);
            // const t_4 = df05_price;
            $("#daytime_total_price").val(function(i,v) {
              return t_1 * discountRate + t_2;
            })
            $(".p_t_text").text("￦"+comma(t_1 * discountRate + t_2));
          }
      
            //페이지 리셋
          $(".reset_btn").click(function(){
            $(".formBox").load("./t_use_reser01_1.html");
          })
        });
