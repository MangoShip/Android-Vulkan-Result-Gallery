const conformanceResultFiles = ["Samsung SM-T510 (ARM Mali - G71)", "Pixel 6 (ARM Mali - G78)", "Samsung SM-T500 (Qualcomm Adreno 610)", 
                                "Qualcomm Lahaina (Qualcomm Adreno 660)", "Motorola Moto G Pure (PowerVR GE8320)", "Nvidia Shield TV Pro (NVIDIA Tegra X1)"];

const conformanceLitmusTest = ["message_passing (single)", "message_passing (barrier)", "store (single)", "store (barrier)",
                                "read (single)", "read (barrier)", "load_buffer (single)", "load_buffer (barrier)", 
                                "store_buffer (single)", "store_buffer (barrier)", "write_22 (single)", "write_22 (barrier)",
                                "corr", "corr (RMW)", "corw2", "corw2 (RMW)", "cowr", "cowr (RMW)", "coww", "coww (RMW)"];
 
const workgroupNum = [[4,8], [16,32], [4,8], [2,8], [8,16], [16,32]];

const workgroupSize = [[4,8], [16,32], [4,8], [4,16], [8,16], [16,32]];

const cellColor = ["#CCFFCC", "#CCFFFF", "#FFCCCC"];


function conformanceMain() {
// Add conformance test result
conformanceResultFiles.forEach(resultFile => {
    var fileName = "./results/conformance/" + resultFile + ".json";
    fetch(fileName)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            var numConfig = data[0].configurations;
            var violatedTestMap = {};

            // Initialize violatedTestMap
            conformanceLitmusTest.forEach(testName => {
                violatedTestMap[testName] = 0;
            })

            for(let i = 0; i < numConfig; i++) {
                var testConfig = data[0][i];

                // Get total number of tests violated
                conformanceLitmusTest.forEach(testName => {
                    var weakBehavior = testConfig[testName]["Weak"];

                    if(weakBehavior > 0) {
                        violatedTestMap[testName]++;
                    }
                })
            }

            var tr = document.getElementById(resultFile + "_conformance");
            var th = document.createElement('th');

            // Add device column
            var resultLink = "<a href=\"" + fileName + "\" download>";

            th.innerHTML = resultLink + resultFile + "</a>";
            tr.appendChild(th);

            var index = conformanceResultFiles.findIndex(name => name === resultFile);

            // Add workgroup number column
            var minWorkgroupNum = workgroupNum[index][0];
            var maxWorkgroupNum = workgroupNum[index][1];
            var workgroupNumRange = document.createTextNode(minWorkgroupNum + "-" + maxWorkgroupNum);
            th = document.createElement('th');
            th.setAttribute('class', 'workgroupColumn');
            th.appendChild(workgroupNumRange);
            tr.appendChild(th);

            // Add workgroup size column
            var minWorkgroupSize = workgroupSize[index][0];
            var maxWorkgroupSize = workgroupSize[index][1];
            var workgroupSizeRange = document.createTextNode(minWorkgroupSize + "-" + maxWorkgroupSize);
            th = document.createElement('th');
            th.setAttribute('class', 'workgroupColumn');
            th.appendChild(workgroupSizeRange);
            tr.appendChild(th);

            // Add list of tests failed
            var nestedTable = document.createElement('table');
            th = document.createElement('th');

            conformanceLitmusTest.forEach(testName => {
                if(violatedTestMap[testName] > 0) {
                    var nestedTr = document.createElement('tr');
                    var nestedTh = document.createElement('th');

                    var violatedTestNode = document.createTextNode(testName);
                    nestedTh.setAttribute('class', 'violatedTestColumn');
                    nestedTh.setAttribute('bgcolor', cellColor[2]);
                    nestedTh.appendChild(violatedTestNode);
                    nestedTr.appendChild(nestedTh);
                    nestedTable.appendChild(nestedTr);
                }
            })
            th.appendChild(nestedTable);
            tr.appendChild(th);

            // Add number of tests failed
            var nestedTable = document.createElement('table');
            th = document.createElement('th');

            conformanceLitmusTest.forEach(testName => {
                if(violatedTestMap[testName] > 0) {
                    var nestedTr = document.createElement('tr');
                    var nestedTh = document.createElement('th');

                    var violatedTestNode = document.createTextNode(violatedTestMap[testName] + "/" + numConfig);
                    nestedTh.setAttribute('class', 'workgroupColumn');
                    nestedTh.appendChild(violatedTestNode);
                    nestedTr.appendChild(nestedTh);
                    nestedTable.appendChild(nestedTr);
                }
            })
            th.appendChild(nestedTable);
            tr.appendChild(th);
        })
        .catch((error) => {
            console.error(error);
        })
    })
}

conformanceMain();