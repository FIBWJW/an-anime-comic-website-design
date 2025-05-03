/*
 * @Description: 
 * @Version: 
 * @Author: Humbert Cheung
 * @Date: 2023-07-01 15:41:56
 * @LastEditors: [Humbert Cheung]
 * @LastEditTime: 2023-07-01 18:31:41
 * @FilePath: /chat-demo/web/views/notice/chat.js
 * Copyright (C) 2023 syzhang. All rights reserved.
 */

function send() {
  // 构造问题内容
  let words = $("#textarea").val();
  let time = dateFormat("YYYY-mm-dd HH:MM", new Date());
  let str = `
    <div class="item item-center"><span>${time}</span></div>
    <div class="item item-right">
        <div class="bubble bubble-right">${words}</div>
        <div class="avatar">
            <img src="img/robot.png" />
        </div>
    </div>
`;
  $($(".content")[0]).append(str);

  // 清空问题输入框
  $("#textarea").val("");

  // 发起请求，构造答案的内容
  $.ajax({
      type: "post",
      url: "/chat",
      data: {
          question: words,
      },
      dataType: "json",
      success: (res) => {
          console.log(res);
          let str = `
            <div class="item item-center"><span>${time}</span></div>
            <div class="item item-left">
                <div class="avatar">
                    <img src="img/robot.png" />
                </div>
                <div class="bubble bubble-left">
                    <p>${res}</p>
                    <button class="speech-btn">🎙️</button>
                </div>
            </div>
        `;
          $($(".content")[0]).append(str);

          // 初始化语音合成对象
          initSpeechSynthesis();

          // 为新添加的语音合成按钮添加事件处理
          addSpeechBtnEvent();
      },
      error: (err) => {
          console.log(err);
      },
  });
}

// 时间格式化函数
function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(
              ret[1],
              ret[1].length == 1? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
      }
  }
  return fmt;
}

let speechSynthesis;
let utterance;

// 初始化语音合成对象
function initSpeechSynthesis() {
  speechSynthesis = window.speechSynthesis;
}

// 进行语音合成
function startSpeechSynthesis(text) {
  utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// 暂停语音合成
function pauseSpeechSynthesis() {
  speechSynthesis.pause();
}

// 恢复语音合成
function resumeSpeechSynthesis() {
  speechSynthesis.resume();
}

// 在成功获取回复并添加到页面后，为语音合成按钮添加事件处理
function addSpeechBtnEvent() {
  $('.speech-btn').click(function() {
      if (speechSynthesis.paused) {
          resumeSpeechSynthesis();
      } else if (speechSynthesis.speaking) {
          pauseSpeechSynthesis();
      } else {
          let text = $(this).siblings('.bubble-left p').text();
          startSpeechSynthesis(text);
      }
  });
}