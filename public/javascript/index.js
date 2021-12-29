//console.log(document.body.firstElementChild.children[1].className);


if(document.body.firstElementChild.children[1].id === "dashboard") {
    document.body.style.backgroundColor = "#f4f4f2";
}

//Dismissible Alert Functionality
let dismissButtons = document.getElementsByClassName("dismissible-button");

Array.from(dismissButtons).forEach(x => {
    x.addEventListener("click", e => {
        e.target.parentElement.style.display = "none";
    });
});

// Special Note: Style property of a form's child element can't be set to none using javascript. To use dismissible alert 
// like the above one dismissible content must be included outside form. That is golden rule. 



// Single User's Bill Update Form

/*

if(document.body.firstElementChild.children[1].className === "single-admin") {

    let billUpdateButton = document.getElementById("bill-update-prompt-button");

    billUpdateButton.addEventListener("click", () => {
        let billUpdateForm = document.getElementById("bill-form-single");
        let formValidationTexts = document.querySelectorAll(".form-validation-texts");

        if(billUpdateForm.style.display === "none") {
            billUpdateForm.style.display = "block";
            formValidationTexts.forEach(item => {
                item.style.display = "none";
            });
        } else {
            billUpdateForm.style.display = "none"
        }
    });

}

*/





// Bill Update Form Validation

let containerChildren = document.body.firstElementChild.children;

if(containerChildren[1].id === "user-list" || containerChildren[1].className === "user-details") {

    let updateButton = document.querySelector(".bill-button");
    let billUpdateForm = document.querySelector(".bill-form");
    let texts = document.querySelectorAll(".form-validation-texts");

    updateButton.addEventListener("click", () => {
        if(billUpdateForm.style.display === "none") {
            billUpdateForm.style.display = "block";
            texts.forEach(item => {
                item.style.display = "none";
            });
        } else {
            billUpdateForm.style.display = "none"
        }
    });

    function checkForm() {

        texts.forEach(text => {
            text.style.display = "none";
        });
    
        
        if(document.getElementById("month").value === "") {
            texts[0].style.display = "block";
            billUpdateForm.style.display = "block";

            // Don't submit the form
            return false;
        }
    
        if(document.getElementById("year").value === "") {
            texts[1].style.display = "block";
            billUpdateForm.style.display = "block";

            // Don't submit the form
            return false;
        }
    
        if(document.getElementById("amount").value === "") {
            texts[2].style.display = "block";
            billUpdateForm.style.display = "block";

            // Don't submit the form
            return false;
        }
    
        if(document.getElementById("comment").value === "") {
            texts[3].style.display = "block";
            billUpdateForm.style.display = "block";

            // Don't submit the form
            return false;
        }
        
        // If all are ok, submit the form to server
        return true;
    }
}



/*
function checkForm() {

    document.getElementById("month-text").style.display = "none";
    document.getElementById("year-text").style.display = "none";
    document.getElementById("amount-text").style.display = "none";
    document.getElementById("comment-text").style.display = "none";


    if(document.getElementById("month").value === "") {
        document.getElementById("month-text").style.display = "block";
        //alert("month is required");
        document.getElementById("bill-form-single").style.display = "block";
        return false;
    }

    if(document.getElementById("year").value === "") {
        document.getElementById("year-text").style.display = "block";
        document.getElementById("bill-form-single").style.display = "block";
        return false;
    }

    if(document.getElementById("amount").value === "") {
        document.getElementById("amount-text").style.display = "block";
        document.getElementById("bill-form-single").style.display = "block";
        return false;
    }

    if(document.getElementById("comment").value === "") {
        document.getElementById("comment-text").style.display = "block";
        document.getElementById("bill-form-single").style.display = "block";
        return false;
    }

    return true
}

*/




// Mass Update User Bill

if(document.body.firstElementChild.children[1].id === "user-list") {

    let selectAllCheckbox = document.querySelector("#select-all");
    let selectOneCheckboxes = document.querySelectorAll(".select-one");
    
    let updateButton = document.querySelector(".bill-button");
    updateButton.style.display = "none";

    let hiddenInputBox = document.querySelector("#hidden-input");
    let formContainerDiv = document.querySelector("#bill-form-mass");
    let userData = [];

    // Change event listener on select all checkbox
    selectAllCheckbox.addEventListener("change", () => {

        // In case user checks the select all checkbox after checking one or more individual checkboxes.
        // It will prevent adding already present user data from individual checks on hiddenInputBox's value. 
        userData = [];

        // Need to run this method to check or uncheck every individual checkbox
        selectOneCheckboxes.forEach(inputBox => {

            // "change" event listener method runs on every check or uncheck action

            // if checkbox changes state from checked to unchecked and vice versa following codes will be executed
            if (!selectAllCheckbox.checked) {
                // Individual checkboxes will be unchecked, button will be disabled and userData array will be empty
                inputBox.checked = "";
                updateButton.style.display = "none";
                userData.pop();
            
            } else {
                // Individual checkboxes will be checked, button will be enabled and userData array will add items
                inputBox.checked = "checked";
                updateButton.style.display = "block";
                userData.push(inputBox.value);

            }
            
        });

        // Updates the value of hiddenInputBox based on the state of the select all checkbox
        hiddenInputBox.value = userData;


        if(!hiddenInputBox.value) {
            formContainerDiv.style.display = "none";
        }
    });

    // Change event listener on individual checkboxes
    selectOneCheckboxes.forEach((box) => {
        box.addEventListener("change", () => {
            if(!box.checked) {
                box.checked = "";
                userData = userData.filter(data => data !== box.value);
               
                hiddenInputBox.value = userData;

                if(!hiddenInputBox.value) {
                    updateButton.style.display = "none";
                    formContainerDiv.style.display = "none";
                }
            } 
            else {
                box.checked = "checked";
                updateButton.style.display = "block";
                userData.push(box.value);
                hiddenInputBox.value = userData;
               
            }
        });
        
        
    });

    /*
    updateButton.addEventListener("click", () => {

        if(formContainerDiv.style.display === "none") {
            formContainerDiv.style.display = "block";
        } else {
            formContainerDiv.style.display = "none";
        }
       
    });
    */
}


