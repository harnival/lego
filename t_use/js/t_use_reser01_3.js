        $(function(){
            $(document).on("selectstart dragstart",function(){ return false})
            // for Total Price ----------
            var discountRate = 1;
            var af01_price = [0,0,0];
            var af04_price = [0,0,0];
            function comma(x) {
              return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          //------------Load-------------
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
          //---------------------------- 01. 이용권 선택 
            $(".af01_e_list dt a").each(function(i){
              $(this).click(function(){
                $(this).toggleClass("slidedowned");
                $(".af01_e_list dt a").not($(this)).removeClass("slidedowned");
                $(".af01_e_l_detail").eq(i).slideToggle();
                $(".af01_e_l_detail").not(`:eq(${i})`).slideUp();
              })
            });
            $(".af01_exp > a").click(function(){
              if ( $(this).hasClass("a_toClose")) {
                $(".af01_e_listWrap").slideToggle();
                $(this)
                  .removeClass("a_toClose")
                  .addClass("a_toOpen");
              } else {
                $(".af01_e_listWrap").slideToggle();
                $(this)
                  .removeClass("a_toOpen")
                  .addClass("a_toClose");
              }
            });

            $(".af01_tc_number input").each(function(i){
              const $newDiv = $("<div><p class='p_s_n_title'></p><p class='p_s_n_number'></p><p class='p_s_n_price'></p></div>");
              $(".p_s_numbers").append($newDiv);

              $(this).change(function(){
                if ( $(this).val() == 0 ) {
                  $newDiv.hide();
                } else {
                  $newDiv.show()
                  if ( i == 0 ) {
                    const price = 119000;
                    $(".p_s_n_title").eq(i).text("STANDARD PASS");
                    $(".p_s_n_number").eq(i).text($(this).val());
                    $(".p_s_n_price").eq(i).text("￦" + $(this).val() * price);
                    af01_price[i] = $(this).val() * price;
                  }
                  if ( i == 1 ) {
                    const price = 169000;
                    $(".p_s_n_title").eq(i).text("GOLD PASS");
                    $(".p_s_n_number").eq(i).text($(this).val());
                    $(".p_s_n_price").eq(i).text("￦" + $(this).val() * price);
                    af01_price[i] = $(this).val() * price;
                  }
                  if ( i == 2 ) {
                    const price = 249000;
                    $(".p_s_n_title").eq(i).text("PLATINUM PASS");
                    $(".p_s_n_number").eq(i).text($(this).val());
                    $(".p_s_n_price").eq(i).text("￦" + $(this).val() * price);
                    af01_price[i] = $(this).val() * price;
                  }
                }
                total();
              })
            })
          // ------------------------------------- 02. 정보입력
          //photo
          let $w = $(".user_photo_cut").width()/2;
          let $h = $(".user_photo_cut").height()/2;
          // cut control
          $(".user_photo").each(function(i){
            const mousekey = {};
            $(this).find(".user_photo_cut_size")
            .on("mousedown", function(e){
              e.stopPropagation();
              mousekey["r"] = true;
            });
            $(document)
            .on("mouseup",function(){
              mousekey["d"] = false;
              mousekey["r"]=false;
            });
            $(this).children(".user_photo_img_wrap")
              .on("mousedown",".user_photo_cut",function(){
                mousekey["d"] = true;
              })
              .on("mouseleave", function(){
                mousekey["d"] = false;
                mousekey["r"]=false;
              })
              .on("mousemove",function(e){
              //move cut
              const cut = $(this).find(".user_photo_cut");
              const pt = $(this).children("canvas").offset().top, pl = $(this).children("canvas").offset().left, ph = $(this).children("canvas").height(), pw = $(this).children("canvas").width();
              let ex = event.movementX, ey = event.movementY,
                widen = ex*ex > ey*ey? ex : ey;
              let ct = cut.offset().top, cl = cut.offset().left,
                ch = cut.height(), cw = cut.width();
              if(mousekey["d"]){
                if(ct < pt){ cut.offset({top: pt+1}); }
                else if(ct+ch >= pt+ph){ cut.offset({top: pt+ph-ch-1}); }
                else { cut.offset({top: ct+ey}); }

                if(cl < pl){ cut.offset({left: pl+1}); }
                else if(cl+cw >= pl+pw){ cut.offset({left: pl+pw-cw-1}); }
                else { cut.offset({left: cl+ex}); }
              }
              //resize cut
              if(mousekey["r"]){
                if(cl+cw < pl+pw && ct+ch < pt+ph) {
                  cut.css({ width : `+=${widen}`, height: `+=${widen}` })
                } else {
                  cut.css({ width : cw-1, height: ch-1 })
                }
              }
            });
          })
          // 입력창 생성
          function makeInfo(classes,typeNum) {
              if( $(`.i_info_${classes}`).length < $(`#annual_${classes}_number`).val()) {
                const $makeInfo = $(`.i_info_origin`).clone(true);

                $makeInfo.addClass([`i_info_${classes}`, "i_info"]);
                $makeInfo.removeClass("i_info_origin");
                $makeInfo.find(".i_i_t_ticket").text(`${classes.toUpperCase()} PASS`);
                $makeInfo.find(".i_i_tab input")
                  .val((i,v) => classes)
                  .data("passtype",typeNum);
                $(".af02_inputBox").append($makeInfo);

                //제거버튼
                $makeInfo.find(".i_i_tab a").click(function(){
                  $makeInfo.remove();
                  $(`#annual_${classes}_number`).val((i,v) => +v-1);
                });
              
                //국가 선택
                $makeInfo.find(".user_nationality_select input").on("click",function(){
                  $(this).siblings("ul").toggle();
                });
                $makeInfo.find(".user_nationality_select li a").click(function(){
                  $(this).parents(".user_nationality_select").find("input").val((i,v) => $(this).text());
                  $(this).parents(".user_nationality_select").find("ul").slideUp("fast");
                });
                $makeInfo.find(".user_name input").on("change",function(){
                  $makeInfo.find(".i_i_t_name").text(`사용자 이름 : ${$(this).val()}`);
                })
                // 슬라이드
                $makeInfo.find(".i_i_tab").on("click",function(){
                  $makeInfo.find(".i_i_inputpage_wrap").slideToggle();
                })
                //이미지
                $makeInfo.find(".user_photo")
                  .on("click",".user_photo_input a:eq(0)",function(){
                    $(this).siblings(".user_photo").trigger("click");
                  })
                  .on("change",".user_photo",function(event){
                    $makeInfo.find(".user_photo_cut").show();
                    $makeInfo.find(".user_photo_sliceBtn").show();
                    const loader = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(loader);
                    reader.onloadend = function(e){
                      const img = new Image();
                      img.src = e.target.result;
                      const can = $makeInfo.find(".user_photo_canvas");
                      can.data("originUrl",e.target.result);
                      img.onload = function(){
                        const iw = img.width, ih = img.height, max_canvas = can.parent().width();
                        const tw = iw<ih? max_canvas*iw/ih: max_canvas, th = iw<ih? max_canvas: max_canvas*ih/iw;
                        can.prop("width", tw).prop("height",th);
                        const ctx = can.get(0).getContext("2d");
                        ctx.drawImage(img, 0, 0,tw, th );
                      }
                    }
                  })
                  .on("click",".user_photo_input a:eq(1)",function(){
                    const finalCanvasSize = 200;
                    const can = $makeInfo.find(".user_photo_canvas");
                    const draw = can.get(0).getContext("2d");
                      draw.clearRect(0,0,can.width(),can.height());
                    const cut = $makeInfo.find(".user_photo_cut"),
                      ct = cut.position().top, cl = cut.position().left, cw = cut.width(), ch = cut.height(),
                      pw = cut.parent().width(), ph = cut.parent().height();
                    const iii = new Image();
                    iii.src = can.data("originUrl");
                    iii.onload = function(){
                      const iw = iii.width, ih = iii.height
                      can.prop("width", finalCanvasSize).prop("height",finalCanvasSize*cw/ch);
                      draw.drawImage(iii,cl*iw/pw,ct*ih/ph,cw*iw/pw,ch*ih/ph,0,0,finalCanvasSize,finalCanvasSize*cw/ch)
                      const da = can.get(0).toDataURL("image/png");
                      can.data("replaceUrl",da);
                      $makeInfo.find(".user_photo_submitOnly").val((i,v) => da);

                      $makeInfo.find(".user_photo_cut").hide();
                      $makeInfo.find(".user_photo_sliceBtn").hide();
                    }
                  })
                  
              }
              // ------------------------------------------
              else if ($(`.i_info_${classes}`).length > $(`#annual_${classes}_number`).val()) {
                $(`.i_info_${classes}`).last().remove();
              }
          }
          $("#annual_standard_number").on("change",function(){
            const price = 119000;
            let n = $(this).val();
            makeInfo("standard",1);
            $(".p_s_n_number").eq(0).text(`수량 : ${n}`);
            $(".p_s_n_price").eq(0).text(`￦ ${comma(n*price)}`);
            if(n==0) {
              $(".p_s_n_standard").hide();
            } else {
              $(".p_s_n_standard").show();
            }

          })
          $("#annual_gold_number").on("change",function(){
            const price = 169000;
            makeInfo("gold",2);
            let n = $(this).val();
            $(".p_s_n_number").eq(1).text(`수량 : ${n}`);
            $(".p_s_n_price").eq(1).text(`￦ ${comma(n*price)}`);
            if(n==0) {
              $(".p_s_n_gold").hide();
            } else {
              $(".p_s_n_gold").show();
            }
          })
          $("#annual_platinum_number").on("change",function(){
            const price = 249000;
            makeInfo("platinum",3)
            let n = $(this).val();
            $(".p_s_n_number").eq(2).text(`수량 : ${n}`);
            $(".p_s_n_price").eq(2).text(`￦ ${comma(n*price)}`);
            if(n==0) {
              $(".p_s_n_platinum").hide();
            } else {
              $(".p_s_n_platinum").show();
            }
          })


          // ------------------------------------- 06-1. 할인적용
          $(".d_list li").each(function(i){
            $(this).find(".d_l_listopen").click(function(){
              $(".d_l_detail").eq(i).slideToggle();
              $(".d_l_detail").not(":eq("+i+")").slideUp()
              $(".d_l_w_exp").eq(i).slideToggle();
              $(".d_l_w_exp").not(":eq("+i+")").slideDown();
            })
          });

          
          $(".d_l_select").each(function(i){
            $(this).click(function(){
              $(".d_list li").eq(i).toggleClass("active_discount");
              $(".d_list li").not(`:eq(${i})`).removeClass("active_discount");
              $(".d_list li input:checkbox").eq(i).prop("checked",function(){
                $(".d_list li input:checkbox").not($(this)).prop("checked",false);
                return !$(this).prop("checked");
              });

              if ( $(".d_list li input:checkbox").eq(i).is(":checked")) {

                $(".p_s_discount > div").show();
                if ( i==0 ) {
                  if ($(".af01_tc_number input").eq(1).val() >= 4 ) {
                    $(".p_s_e_title06").text("KB국민카드 제휴 할인");
                    $(".p_s_e_number06").text("GOLD PASS 4장 이상 구매 시 10% 할인")
                    discountRate = 1 - 0.1;
                  } else {
                    alert("GOLD PASS 4장 이상 구매 시 적용 가능합니다.");
                    $(".d_list li").eq(i).removeClass("active_discount");
                    $(".d_list li input:checkbox").eq(i).prop("checked",false);
                    discountRate = 1;
                  }
                }    
              } else if (!$(".d_list li input:checkbox").is(":checked")) {
                $(".p_s_discount > div").hide();
              }
              
              total();
            });
          });
         

          // ------------------------------------- 06-2. 가격 합산
          
          const total = function() {
            $("#annual_total_price").val(function(i,v) {
              if ($(".af01_tc_number input").eq(1).val() >= 4) {
                af01_price[1] *= discountRate;
              }
              const t_1 = af01_price.reduce((a,b) => a+b);
              const t_2 = af04_price.reduce((a,b) => a+b);
              $(".p_t_text").text("￦"+comma(t_1+t_2));
              
              return t_1 + t_2
            })
            
          }
          
            //페이지 리셋
          $(".reset_btn").click(function(){
            $(".formBox").load("/t_use/t_use_reser01_1.html");
          })
        });
