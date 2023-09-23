function makeMd5(s) {
    // get md5 from s
    return md5(s);
}

function calcMd5Distance(s1, s2) {
    let distance = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) {
            continue;
        }
        distance += Math.abs(s1.charCodeAt(i) - s2.charCodeAt(i));
    }
    return distance;
}

function makeSortedNameHashDistanceTuple(targetHash, names) {
    let nameHashDistanceTuple = names.map((name) => {
        let nameMd5 = makeMd5(name);
        let distance = calcMd5Distance(targetHash, nameMd5);
        return [name, nameMd5, distance];
    });
    // sort by distance
    nameHashDistanceTuple.sort((a, b) => {
        return a[2] - b[2];
    });
    return nameHashDistanceTuple;
}

function updateTupleToTable(tupleList, limit=Math.Infinity) {
    let area = $('#table-body')
    area.empty();
    for (let i = 0; i < Math.min(tupleList.length, limit); i++) {
        let name = tupleList[i][0];
        let md5 = tupleList[i][1];
        let distance = tupleList[i][2];
        let row = `<tr><td>${i + 1}</td><td>${name}</td><td>${md5}</td><td>${distance}</td></tr>`;
        area.append(row);
    }
}

$(document).ready(function () {
    $("#roll").click(() => {
        let saltHash = makeMd5($("#salt").val());
        $('#salt-hash').val(saltHash);
        // console.log('salt hash:', saltHash);
        // use regex [\n ] to split #people
        let names = $("#people").val().split(/[\n ,|，。]/);
        // console.log('names:', names);
        let nameHashDistanceTuple = makeSortedNameHashDistanceTuple(saltHash, names);
        console.log('name hash distance tuple:', nameHashDistanceTuple);
        updateTupleToTable(nameHashDistanceTuple, 50);
        let count = parseInt($("#count").val());
        if (count == NaN) {
            return;
        }
        let luckyNames = nameHashDistanceTuple.slice(0, count).map((tuple) => {
            return tuple[0];
        });
        $("#output").val(luckyNames.join(', '));
    });
    $('#copy').click(() => {
        let output = $('#output');
        let val = output.val();
        navigator.clipboard.writeText(val).then(() => {
            Swal.fire('已复制');
        }, (err) => {
            Swal.fire('浏览器不支持 navigator API，尝试回退方案');
            output.select();
            document.execCommand("copy");
        });
    });
});