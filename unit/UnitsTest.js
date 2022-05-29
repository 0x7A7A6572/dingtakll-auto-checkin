importClass(java.lang.System);
/*
  testfunc = {
      unitName:[String], 测试单元名
      unit:[Function],   测试单元 -> 
  }
*/
UnitsTest = {
    NOT_TESTED: -1,
    FAILED: 0,
    SUCCESS: 1,
    TESTING: 2,
    statusText: {
                 nottested:"［-］", 
                 failed:"［x］", 
                 success:"［√］", 
                 testing:"［>］"
                 },
    forcedStop: false,
    title: "",
    unitList: [], //function List
    _unitNameList: [],
    unitTestResults: {}, //unitName: result[Boolean]
    addUnitTest: function(testUnit) {
        if (testUnit != null && testUnit.unitName != null) {
            this.unitList.push(testUnit);
            this._unitNameList.push(testUnit.unitName);
            this.unitTestResults[testUnit.unitName] = this.NOT_TESTED;
        } else {
            console.error("UnitTest.addUnitTest 参数错误")
        }
        return this;
    },
    setTestStatu: function(unitName, statu) {
       // unitName = unitName.replace(/［.］   /g,"");
        this.unitTestResults[unitName] = statu;
       // this._unitNameList[]
    },
    getUnitStatu: function(unitName){
        
        let statu = this.unitTestResults[unitName];
        //console.info(this.unitTestResults, statu, unitName)
        let statu_text = "［?］";
   // -1未测试 0失败 1成功 2测试中
        switch (statu) {
            case this.NOT_TESTED:
                statu_text = this.statusText.nottested;
                break;
            case this.FAILED:
                statu_text = this.statusText.failed;
                break;
            case this.SUCCESS:
                statu_text = this.statusText.success;
                break;
            case this.TESTING:
                statu_text = this.statusText.testing;
                break;
        }
      return statu_text;
         
    },
    setTitle: function(title){ this.title = title; return this;},
    show: function(isAutoTestAll) {
        this._unitNameList = formatUnitNames(this._unitNameList);
        if (!isAutoTestAll) {
            
            let select = dialogs.select(this.title, this._unitNameList.slice());
            switch (select) {
                case -1:
                    break;
                default:
                    try {
                        //console.log("show-run:",this.unitList[select].unitName)
                        this.setTestStatu(this.unitList[select].unitName, this.TESTING);
                        this.unitList[select].unit();
                    } catch (e) {
                        //let trace = new System.Diagnostics.StackTrace(e, true);            
                        //console.WriteLine("Line: " + trace.GetFrame(0).GetFileLineNumber());
                        console.error("UnitTest[" + this.unitList[select].unitName + ":line:"+ e.stack +"] Error: " + e);
                        this.setTestStatu(this.unitList[select].unitName, this.FAILED);
                    } finally {
                        
                        this.show();
                    }
            }

        } else {
            this.unitList.forEach((unit) => {
                try {
                    unit.unit();
                } catch (e) {
                    console.error("UnitTest[" + unit.unitName + "] Error: " + e);
                }
                if (this.forcedStop) {
                    this.forcedStop = false;
                    return;
                }
            });
        }
    },
    stopBeforeNext: function() {
        this.forcedStop = true;
    } //执行完该项测试才停止
    //dismiss: function() {},
    //testDialog: null, //run之后才有返回值
    /*testDialogView: ui.inflate(
        <vertical>
                <list>
                    <linear id="unitsList">
                        <text id="unitName" text={{unitName}} />
                        <text id="testResult" text="" />
                    </linear>
                </list>
            </vertical>)*/
}

function formatUnitNames(nameList){
    
    nameList.forEach((v,k)=>{
        v = v.replace(/［.］   /g,"");
        nameList[k] = UnitsTest.getUnitStatu(v) + "   " + v;
    });
    return nameList;
}
 
module.exports = UnitsTest;