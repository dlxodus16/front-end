const app = Vue.createApp({
    data(){
        return{
            showInput:[false,false,false],
            selectSubject:null,
            scoresPass:[],
            scores:[],
            totalCredit:[0,0,0],
            totalAttendance:[0,0,0],
            totalAssignment:[0,0,0],
            totalMidterm:[0,0,0],
            totalFinal:[0,0,0],
            totalSumScore:[0,0,0],
            avgScore:[0,0,0],
            subject:'',
            credit:0,
            attendanceScore:0,
            assignmentScore:0,
            midtermExam:0,
            finalExam:0,
            showCredit:true,
            pass:''
        }
    },
    watch:{
        subject(newVal,oldVal){
            let subjects = []
            for(let i=0;i<this.scoresPass.length;i++){
                subjects.push(this.scoresPass[i].subject)
            }
            for(let j=0;j<this.scores.length;j++){
                subjects.push(this.scores[j].subject)
            }
            if(subjects.includes(newVal)){
                alert('중복된 과목이 있습니다.')
                this.subject = oldVal
            }
        },
        credit(val){
            if(val===1){
                this.showCredit = false
            }else{
                this.showCredit = true
            }
        },
        attendanceScore(val){
            if(val>20){
                this.attendanceScore = 20
            }else if(val<0){
                this.attendanceScore = 0
            }
        },
        assignmentScore(val){
            if(val>20){
                this.assignmentScore = 20
            }else if(val<0){
                this.assignmentScore = 0
            }
        },
        midtermExam(val){
            if(val>30){
                this.midtermExam = 30
            }else if(val<0){
                this.midtermExam = 0
            }
        },
        finalExam(val){
            if(val>30){
                this.finalExam = 30
            }else if(val<0){
                this.finalExam = 0
            }
        }
    },
    computed:{

    },
    methods:{
        addScore(val){
            this.showInput[val] = true
        },
        saveScore(val){
            if(this.credit==1){
                if(this.complete!=null && this.required!=null){
                    let item = {
                        complete:this.complete,
                        required:this.required,
                        subject:this.subject,
                        credit:this.credit,
                        pass:this.pass,
                        grade:val
                    }
                    this.scoresPass.push(item)
                    this.complete = null
                    this.required = null
                    this.subject = null
                    this.credit = null
                    this.pass = null
                    this.showInput[val] = false
                    this.sort()
                }
            }else{
                if(this.complete!=null && this.required!=null){
                    let item={
                        complete:this.complete,
                        required:this.required,
                        subject:this.subject,
                        credit:this.credit,
                        attendanceScore:this.attendanceScore,
                        assignmentScore:this.assignmentScore,
                        midtermExam:this.midtermExam,
                        finalExam:this.finalExam,
                        totalScore:this.attendanceScore+this.assignmentScore+this.midtermExam+this.finalExam,
                        grade:val
                    }
                    this.scores.push(item)
                    this.complete = null
                    this.required = null
                    this.subject = null
                    this.credit = null
                    this.attendanceScore = null
                    this.assignmentScore = null
                    this.midtermExam = null
                    this.finalExam = null
                    this.showInput[val] = false
                    this.sort()
                    this.sumScore()
                }
            }
            
        },
        sumScore(){
            this.totalCredit = [0,0,0]
            this.totalAttendance = [0,0,0]
            this.totalAssignment= [0,0,0]
            this.totalMidterm = [0,0,0]
            this.totalFinal = [0,0,0]
            this.totalSumScore = [0,0,0]
            for(let k=0;k<this.scores.length;k++){
                const localGrade = this.scores[k].grade - 1
                this.totalCredit[localGrade] += this.scores[k].credit
                this.totalAttendance[localGrade] += this.scores[k].attendanceScore
                this.totalAssignment[localGrade] += this.scores[k].assignmentScore
                this.totalMidterm[localGrade] += this.scores[k].midtermExam
                this.totalFinal[localGrade] += this.scores[k].finalExam
                this.totalSumScore[localGrade] += this.scores[k].totalScore
            }
            if(this.scores.length==0){
                this.avgScore = [0,0,0]
            }else{
                for(let l=1;l<=3;l++){
                    let array = this.scores.filter(val => val.grade == l)
                    if(array.length===0){
                        this.avgScore[l-1] = 0
                        continue;
                    }
                    this.avgScore[l-1] = this.totalSumScore[l-1] / (array.length)
                }
            }
        },
        removeScore(val){
            totalLength = this.gradeFilter(val,this.scoresPass).length + this.gradeFilter(val,this.scores).length
            if(this.selectSubject==null){
                alert('삭제할 행을 선택해주세요.')
            }else if(totalLength<(this.selectSubject+1)){
                alert('삭제할 행이 없습니다.')
            }else if(this.selectSubject>=this.gradeFilter(val,this.scoresPass).length){
                if(confirm(`${val}학년 ${this.selectSubject+1}번째 행을 삭제하시겠습니까?`)){
                    index = this.selectSubject-this.gradeFilter(val,this.scoresPass).length
                    arr = this.scores.filter(i => i.grade == val)
                    subjectKey = arr[index].subject
                    this.scores = this.scores.filter(j => j.subject!=subjectKey)
                    this.sort()
                    this.sumScore()
                    this.selectSubject=null
                }
            }else{
                if(confirm(`${val}학년 ${this.selectSubject+1}번째 행을 삭제하시겠습니까?`)){
                    arr = this.scoresPass.filter(i => i.grade == val)
                    subjectKey = arr[this.selectSubject].subject
                    this.scoresPass = this.scoresPass.filter(j => j.subject!=subjectKey)
                    this.sort()
                    this.selectSubject=null
                }
            }
        },
        record(score){
            if(score>=95){
                return 'A+'
            }else if(score>=90){
                return 'A0'
            }else if(score>=85){
                return 'B+'
            }else if(score>=80){
                return 'B0'
            }else if(score>=75){
                return 'C+'
            }else if(score>=70){
                return 'C0'
            }else if(score>=65){
                return 'D+'
            }else if(score>=60){
                return 'D0'
            }else{
                return 'F'
            }
        },
        sort(){
            this.scores.sort((a,b) => a.complete.localeCompare(b.complete)||a.required.localeCompare(b.required)||a.subject.localeCompare(b.subject));
        },
        gradeFilter(val,arr){
            return arr.filter((i)=>{
                return i.grade === val                    
            });
        }
    }
})
app.mount('#app')
