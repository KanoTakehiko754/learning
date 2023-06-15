// Elementの取得
const newTask = document.getElementById("new-task");
const addButton = document.getElementById("add")
const tasks = document.getElementById("tasks");
const doneNumber = document.getElementById("done-number")
const undoneNumber = document.getElementById("undone-number");
const clearButton = document.getElementById("clear");

//nextTaskNumberがローカルストレージに保存されていなければ0で初期化
if (localStorage.getItem("nextTaskNumber") === null) {
    localStorage.setItem("nextTaskNumber",0);
};

//完了したタスクと未完了のタスクの数を数えて反映する関数
function countTasks() {
    doneNumber.innerText = document.querySelectorAll(".completed-todo-item").length;
    undoneNumber.innerText = document.querySelectorAll(".todo-item").length;
};

//タスクと編集ボタンと削除ボタンのセットを作成・追加
function createTaskUnion(taskName, taskNumber, completed) {
    //タスクと削除ボタンのセット
    const taskUnion = document.createElement("div");
    taskUnion.setAttribute("data-taskNumber", taskNumber);
    taskUnion.classList.add("task-union");
    if (completed) {
        taskUnion.classList.add("completed-todo-item");
    } else {
        taskUnion.classList.add("todo-item");
    };
    tasks.append(taskUnion);

    //タスクを画面に追加
    const taskNameElement = document.createElement("span");
    taskNameElement.classList.add("task-name");
    taskNameElement.innerText = taskName;
    //アイテムが押されたとき、そのアイテムのクラスを「todo-item」と「completed-todo-item」間で入れ替え、ローカルストレージにも変更を記録する
    taskNameElement.onclick = function(event) {
        const target = event.target;
        const taskUnion = target.parentElement
        const taskNumber = taskUnion.getAttribute("data-taskNumber");
        const taskName = target.innerText;
        if (taskUnion.classList.contains("todo-item")){
            taskUnion.classList.remove("todo-item");
            taskUnion.classList.add("completed-todo-item");
            localStorage.setItem("task"+String(taskNumber), "1"+taskName);
        } else {
            taskUnion.classList.remove("completed-todo-item");
            taskUnion.classList.add("todo-item");
            localStorage.setItem("task"+String(taskNumber), "0"+taskName);
        };
        countTasks();
    };
    taskUnion.append(taskNameElement);

    //編集ボタンを追加
    const editButton = document.createElement("button");
    editButton.innerText = "編集";
    editButton.classList.add("edit-button");
    editButton.onclick = function(event) {
        const target = event.target;
        const taskUnion = target.parentElement;
        const taskNameElement = taskUnion.querySelector(".task-name");
        const taskName = taskNameElement.innerText;
        const deleteButton = taskUnion.querySelector(".delete-button");
        const editButton = taskUnion.querySelector(".edit-button")
        const taskNumber = taskUnion.getAttribute("data-taskNumber");
        const completed = taskUnion.classList.contains("completed-todo-item"); 
    
        //タスクの名前と削除ボタンと編集ボタンを非表示
        taskNameElement.setAttribute("hidden",true);
        deleteButton.setAttribute("hidden",true);
        editButton.setAttribute("hidden", true);
    
        //編集用の欄と確定ボタンを追加
        const editField = document.createElement("input");
        editField.classList.add("edit-field");
        editField.value = taskName;
        taskUnion.append(editField);
    
        const commitButton = document.createElement("button");
        commitButton.classList.add("edit-commmit")
        commitButton.innerText = "確定";
        commitButton.onclick = function(event) {
            const newName = editField.value;
            taskNameElement.innerText = newName;
            if (completed){
                localStorage.setItem("task"+taskNumber, "1"+newName);
            } else {
                localStorage.setItem("task"+taskNumber, "0"+newName);
            };
            taskNameElement.removeAttribute("hidden");
            deleteButton.removeAttribute("hidden");
            editButton.removeAttribute("hidden");
            editField.remove();
            commitButton.remove();
        };
        taskUnion.append(commitButton);
    };
    taskUnion.append(editButton);

    //削除ボタンを追加
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "削除";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function(event) {
        const target = event.target;
        const taskUnion = target.parentElement;
        const taskNumber = taskUnion.getAttribute("data-taskNumber");
    
        taskUnion.remove();
        localStorage.removeItem("task"+taskNumber);
        countTasks();
        if (taskNumber == localStorage.getItem("nextTaskNumber")-1) {
            localStorage.setItem("nextTaskNumber", taskNumber);
        };
    };
    taskUnion.append(deleteButton);

    //複製ボタンを追加
    const copyButton = document.createElement("button");
    copyButton.innerText = "複製";
    copyButton.classList.add("copy-button");
    copyButton.onclick = function(event) {
        const taskUnion = event.target.parentElement;
        const taskName = taskUnion.querySelector(".task-name").innerText;
        const taskNumber = localStorage.getItem("nextTaskNumber");
        const taskCompleted = taskUnion.classList.contains("completed-todo-item");
        createTaskUnion(taskName, taskNumber, taskCompleted);
    };
    taskUnion.append(copyButton);
    countTasks();
};

//保存済みのタスクを画面に追加(todo-itemクラス)
window.onload = function() {
    nextTaskNumber = Number(localStorage.getItem("nextTaskNumber"));
    for (let i = 0; i < nextTaskNumber; i++) {
        const taskValue = localStorage.getItem("task"+String(i));
        if (taskValue !== null) {
            const taskCompleted = taskValue[0] === "1";
            const taskName = taskValue.slice(1);
            createTaskUnion(taskName, i, taskCompleted);
        };
    };
    countTasks();
};

//追加ボタンが押されたらタスクを画面に追加(todo-itemクラス)し、ローカルストレージにも追加
addButton.onclick = function(event) {
    //タスクを画面に追加
    const taskName = newTask.value;
    const nextTaskNumber = localStorage.getItem("nextTaskNumber");
    createTaskUnion(taskName, nextTaskNumber, false);

    //入力欄をリセット
    newTask.value = "";

    //ローカルストレージに保存
    localStorage.setItem("task" + String(nextTaskNumber),"0"+taskName);
    localStorage.setItem("nextTaskNumber",Number(nextTaskNumber) + 1);
};

//全て削除するボタンが押されたら全ての項目を削除する
clearButton.onclick = function (event){
    const tasksCopy = tasks.concat(); 
    const clickEvent = new Event("click");
    /*{
        const deleteButton = taskUnion.querySelector(".delete-button");
        deleteButton.dispatchEvent(clickEvent); 
    };*/
};