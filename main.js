// ==UserScript==
// @name         FC Sniffer + Auto POST + UI + Response
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Theo dõi FC trong span, log thời gian thực, gửi POST khi > min, hiển thị response
// @match        *://typhu.fconline.garena.vn/*
// @run-at       document-idle
// ==/UserScript==

(function () {
    const buffer = []; // lưu lịch sử FC + response
    let intervalId = null;
    let sniffing = false;
    let minValue = 1400; // min threshold để gửi POST
    let maxValue = Infinity; // max threshold để dừng sniffer

    const buttonStyle = `
        background: #1e88e5;
        color: #fff;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        margin-left: 8px;
        font-size: 12px;
        transition: background 0.2s;
    `;

    function sendPost(number) {
        fetch('https://typhu.fconline.garena.vn/api/user/spin', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'accept-language': 'vi-VN,vi;q=0.8',
                'content-type': 'application/json',
                'foo': 'bar',
                'origin': 'https://typhu.fconline.garena.vn',
                'referer': 'https://typhu.fconline.garena.vn/',
                'x-csrftoken': 'LChW3ZjLvGemAbwbJPgXMhErIloEKzZCeoVTGFI9WU0pu2aIPtUh7kdShO2V9XMl',
            },
            body: JSON.stringify({spin_type:2, payment_type:1}),
            credentials: 'include'
        }).then(res => res.json())
          .then(data => {
              console.log("POST response:", data);
              const now = new Date().toLocaleTimeString();
              buffer.push({time: now, fc: number, response: JSON.stringify(data)});
              renderTable();
          })
          .catch(err => console.error(err));
    }

    function createUI() {
        if(document.getElementById("fc-sniffer-ui")) return;

        const container = document.createElement("div");
        container.id = "fc-sniffer-ui";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.width = "520px";
        container.style.maxHeight = "600px";
        container.style.overflow = "hidden";
        container.style.background = "#e3f2fd";
        container.style.border = "1px solid #90caf9";
        container.style.padding = "0";
        container.style.zIndex = "999999";
        container.style.fontSize = "13px";
        container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        container.style.borderRadius = "12px";
        container.style.boxShadow = "0 5px 20px rgba(0,0,0,0.4)";
        container.style.color = "#0d47a1";
        container.style.display = "flex";
        container.style.flexDirection = "column";

        container.innerHTML = `
        <div style="padding:12px 15px; background:#1565c0; border-bottom:1px solid #0d47a1; border-radius:12px 12px 0 0; color:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="font-size:16px;">💰 FC Sniffer (by ThuyenDev)</b>
                <div>
                    <button id="fc-clear" style="${buttonStyle}">🗑️ Xóa</button>
                    <button id="fc-download" style="${buttonStyle}">⬇️ Tải xuống</button>
                </div>
            </div>
            <div style="margin-top:8px; display:flex; gap:6px; align-items:center;">
                <input type="number" id="fc-min" placeholder="Min" style="width:80px; padding:4px; border-radius:4px; border:1px solid #90caf9;" value="1400">
                <input type="number" id="fc-max" placeholder="Max" style="width:80px; padding:4px; border-radius:4px; border:1px solid #90caf9;" value="2000">
                <button id="fc-start" style="${buttonStyle}">▶️ Bắt đầu</button>
                <button id="fc-stop" style="${buttonStyle}">⏹️ Dừng</button>
            </div>
        </div>
        <div style="overflow-y:auto; flex-grow:1;">
            <table id="fc-table" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:#90caf9; position:sticky; top:0;">
                        <th style="padding:10px; text-align:left;">#</th>
                        <th style="padding:10px; text-align:left;">Thời gian</th>
                        <th style="padding:10px; text-align:left;">FC</th>
                        <th style="padding:10px; text-align:left;">POST Response</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        `;
        document.body.appendChild(container);

        // Button events
        container.querySelector("#fc-clear").onclick = () => { buffer.length=0; renderTable(); };
        container.querySelector("#fc-download").onclick = () => {
            const data = buffer.map(e=>`${e.time} - ${e.fc} - ${e.response}`).join("\n");
            const blob = new Blob([data], {type:"text/plain"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "fc_log.txt"; a.click(); URL.revokeObjectURL(url);
        };
        container.querySelector("#fc-start").onclick = () => {
            minValue = parseFloat(document.querySelector("#fc-min").value) || 1400;
            maxValue = parseFloat(document.querySelector("#fc-max").value) || Infinity;
            if(intervalId) clearInterval(intervalId);
            startSniffer();
        };
        container.querySelector("#fc-stop").onclick = () => {
            sniffing=false;
            if(intervalId) clearInterval(intervalId);
        };
    }

    function renderTable() {
        const tbody = document.querySelector("#fc-table tbody");
        if(!tbody) return;
        tbody.innerHTML = "";
        buffer.forEach((item,i)=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `<td style="padding:6px;">${i+1}</td>
                            <td style="padding:6px;">${item.time}</td>
                            <td style="padding:6px;">${item.fc}</td>
                            <td style="padding:6px; word-break:break-all;">${item.response || ''}</td>`;
            tbody.appendChild(tr);
        });
    }

    function startSniffer() {
        sniffing=true;
        intervalId = setInterval(()=>{
            if(!sniffing) return;
            const span = document.querySelector('span.text-special.animation');
            if(!span) return;
            const text = span.textContent.trim(); // "11.853 FC"
            const number = parseFloat(text.replace(/\./g, '')); // loại bỏ dấu chấm

            const now = new Date().toLocaleTimeString();
            buffer.push({time: now, fc: number, response: ''});
            renderTable();

            if(number >= minValue && number <= maxValue){
                console.log(`FC ${number} vượt min (${minValue}), gửi POST!`);
                sendPost(number);
            }

            if(number > maxValue){
                console.log(`FC ${number} vượt max (${maxValue}), dừng sniffer!`);
                sniffing=false;
                clearInterval(intervalId);
            }
        },1000);
    }

    createUI();
})();
