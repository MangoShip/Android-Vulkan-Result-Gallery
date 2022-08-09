const resultFiles = ["Pixel 6 (ARM Mali - G78)", "Samsung SM-T500 (Qualcomm Adreno 610)", "Qualcomm Lahaina (Qualcomm Adreno 660)", "Samsung SM-T510 (ARM Mali - G71)", "Motorola Moto G Pure (PowerVR GE8320)", "Nvidia Shield TV Pro (NVIDIA Tegra X1)"];

const deviceSpecLink = ["https://www.notebookcheck.net/ARM-Mali-G78-MP20-GPU-Benchmarks-and-Specs.581804.0.html",
                        "https://www.notebookcheck.net/Qualcomm-Adreno-610-GPU-Benchmarks-and-Specs.434054.0.html",
                        "https://www.notebookcheck.net/Qualcomm-Adreno-660-GPU-Benchmarks-and-Specs.513908.0.html",
                        "https://www.notebookcheck.net/ARM-Mali-G71-MP2-GPU.273124.0.html",
                        "https://www.notebookcheck.net/PowerVR-GE8320-Graphics-Card-Benchmarks-and-Specs.372646.0.html",
                        "https://www.notebookcheck.net/NVIDIA-Tegra-X1-SoC-for-Tablets-Processor-Specs-and-Benchmarks.137102.0.html"];

const litmusTest = ["Message Passing Default", "Store Default", "Read Default",
                    "Load Buffer Default", "Store Buffer Default", "2+2 Write Default"];

const workgroupNum = [[16,32], [4,8], [2,8], [4,8], [8,16], [16,32]];

const workgroupSize = [[16,32], [4,8], [4,16], [4,8], [8,16], [16,32]];

const cellColor = ["#CCFFCC", "#CCFFFF", "#FFCCCC"];

function main() {

    var table = document.getElementById("table");
    var testCount = 0;

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

                var tr = document.createElement('tr');
                var th = document.createElement('th');

                // Add device column
                var resultLink = "<a href=\"" + fileName + "\" download>";

                th.innerHTML = resultLink + resultFile + "</a>";
                tr.appendChild(th);

                // Add workgroup number column
                var minWorkgroupNum = workgroupNum[testCount][0];
                var maxWorkgroupNum = workgroupNum[testCount][1];
                var workgroupNumRange = document.createTextNode(minWorkgroupNum + "-" + maxWorkgroupNum);
                th = document.createElement('th');
                th.setAttribute('class', 'testColumn');
                th.appendChild(workgroupNumRange);
                tr.appendChild(th);

                // Add workgroup size column
                var minWorkgroupSize = workgroupSize[testCount][0];
                var maxWorkgroupSize = workgroupSize[testCount][1];
                var workgroupSizeRange = document.createTextNode(minWorkgroupSize + "-" + maxWorkgroupSize);
                th = document.createElement('th');
                th.setAttribute('class', 'testColumn');
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
                table.appendChild(tr);

                // Add device spec link
                var deviceSpecs = document.getElementById('deviceSpecs');

                var listElement = document.createElement('li');
                var deviceLink =  "<a href=\"" + deviceSpecLink[testCount] + "\">";

                listElement.innerHTML = deviceLink + resultFile + "</a>";
                deviceSpecs.appendChild(listElement);


                testCount++;
            })
            .catch((error) => {
                console.error(error);
            })

    })

}

main();