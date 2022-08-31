const resultFiles = ["Samsung SM-T510 (ARM Mali - G71)", "Pixel 6 (ARM Mali - G78)", "Samsung SM-T500 (Qualcomm Adreno 610)", 
                     "OnePlus 7T (Adreno (TM) 640)", "(Adreno (TM) 642L)", "Qualcomm Lahaina (Qualcomm Adreno 660)",  
                     "Motorola Moto G Pure (PowerVR GE8320)", "Nvidia Shield TV Pro (NVIDIA Tegra X1)"];

const conformanceResultFiles = ["Samsung SM-T510 (ARM Mali - G71)", "Pixel 6 (ARM Mali - G78)", "Samsung SM-T500 (Qualcomm Adreno 610)", 
                                "Qualcomm Lahaina (Qualcomm Adreno 660)", "Motorola Moto G Pure (PowerVR GE8320)", "Nvidia Shield TV Pro (NVIDIA Tegra X1)"];

const litmusTest = ["Message Passing Default", "Store Default", "Read Default",
                    "Load Buffer Default", "Store Buffer Default", "2+2 Write Default"];

const conformanceLitmusTest = ["message_passing (single)", "message_passing (barrier)", "store (single)", "store (barrier)",
                               "read (single)", "read (barrier)", "load_buffer (single)", "load_buffer (barrier)", 
                               "store_buffer (single)", "store_buffer (barrier)", "write_22 (single)", "write_22 (barrier)",
                               "corr", "corr (RMW)", "corw2", "corw2 (RMW)", "cowr", "cowr (RMW)", "coww", "coww (RMW)"];

const workgroupNum = [[4,8], [16,32], [4,8], [4,8], [4,8], [4,8], [8,16], [16,32]];

const workgroupSize = [[4,8], [16,32], [4,8], [4,16], [4,16], [4,16], [8,16], [16,32]];

const cellColor = ["#CCFFCC", "#CCFFFF", "#FFCCCC"];

function main() {

    // Add test result
    resultFiles.forEach(resultFile => {
        var fileName = "./results/" + resultFile + ".json";
        fetch(fileName)
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                var numConfig = data[0].configurations;
                var seqBehaviorMap = {};
                var interBehaviorMap = {};
                var weakBehaviorMap = {};
                var totalBehaviorMap = {};

                // Initialize behavior maps
                litmusTest.forEach(testName => {
                    seqBehaviorMap[testName] = 0;
                    interBehaviorMap[testName] = 0;
                    weakBehaviorMap[testName] = 0;
                    totalBehaviorMap[testName] = 0;
                })

                for(let i = 0; i < numConfig; i++) {
                    var testConfig = data[0][i];

                    // Get total behaviors
                    litmusTest.forEach(testName => {
                        var seqBehavior = testConfig[testName]["seq"];
                        var interBehavior = testConfig[testName]["interleaved"];
                        var weakBehavior = testConfig[testName]["weak"];

                        seqBehaviorMap[testName] += seqBehavior;
                        interBehaviorMap[testName] += interBehavior;
                        weakBehaviorMap[testName] += weakBehavior;
                        totalBehaviorMap[testName] += (seqBehavior + interBehavior + weakBehavior);
                    })
                }

                var tr = document.getElementById(resultFile);
                var th = document.createElement('th');

                // Add device column
                var resultLink = "<a href=\"" + fileName + "\" download>";

                th.innerHTML = resultLink + resultFile + "</a>";
                tr.appendChild(th);

                var index = resultFiles.findIndex(name => name === resultFile);

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

                // Add test columns
                litmusTest.forEach(testName => {
                    var th = document.createElement('th');
                    var nestedTable = document.createElement('table');
                    var nestedTr = document.createElement('tr');
                    var nestedTh = document.createElement('th');

                    var seqBehavior = document.createTextNode(seqBehaviorMap[testName]);
                    var interBehavior = document.createTextNode(interBehaviorMap[testName]);
                    var weakBehavior = document.createTextNode(weakBehaviorMap[testName]);
                    var behaviors = [seqBehavior, interBehavior, weakBehavior];
                    var behaviorCount = 0;

                    // Number of behaviors
                    behaviors.forEach(behavior => {
                        nestedTh = document.createElement('th');
                        nestedTh.setAttribute('class', 'behaviorColumn');
                        nestedTh.setAttribute('bgcolor', cellColor[behaviorCount]);
                        nestedTh.appendChild(behavior);
                        nestedTr.appendChild(nestedTh);
                        behaviorCount++;
                    })
                    nestedTable.appendChild(nestedTr);

                    var totalBehavior = totalBehaviorMap[testName];
                    var seqBehaviorPer = document.createTextNode(((seqBehaviorMap[testName] / totalBehavior) * 100).toFixed(2));
                    var interBehaviorPer = document.createTextNode(((interBehaviorMap[testName] / totalBehavior) * 100).toFixed(2));
                    var weakBehaviorPer = document.createTextNode(((weakBehaviorMap[testName] / totalBehavior) * 100).toFixed(2));
                    var behaviorsPer = [seqBehaviorPer, interBehaviorPer, weakBehaviorPer];
                    nestedTr = document.createElement('tr');
                    behaviorCount = 0;

                    // Percentage of behaviors
                    behaviorsPer.forEach(perc => {
                        nestedTh = document.createElement('th');
                        nestedTh.setAttribute('class', 'testColumn');
                        nestedTh.setAttribute('bgcolor', cellColor[behaviorCount]);
                        nestedTh.appendChild(perc);
                        nestedTr.appendChild(nestedTh);
                        behaviorCount++;
                    })
                    nestedTable.appendChild(nestedTr);

                    th.appendChild(nestedTable)
                    tr.appendChild(th);
                })
            })
            .catch((error) => {
                console.error(error);
            })

    })
}

main();