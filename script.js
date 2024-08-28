const inputContainer = document.querySelector(".text-input-container");
const INPUT_CLASS = "input-box";
const KEY_CODES = {
    BACKSPACE_KEY: "Backspace",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    DIGITS: "Digit",
};
const LEFT = "left";
const RIGHT = "right";
const clearButton = document.querySelector('.clear-btn');
const firstBox = document.querySelector(".input-box");


firstBox.focus();

const handleKeydown = (e, elementId) => {
    if (e.code === KEYBOARD_KEYS.BACKSPACE_KEY) {
        e.preventDefault();
        if (e.target.value) {
            e.target.value = "";
            return;
        }

        //
        if (!e.target.value) {
            moveToPreviousInputBox(elementId, e);
        }
    }

    if (e.code === KEYBOARD_KEYS.ARROW_LEFT) {
        moveToPreviousInputBox(elementId);
    }
    if (e.code === KEYBOARD_KEYS.ARROW_RIGHT) {
        moveToNextInputBox(elementId);
    }
    if (e.code.includes(KEYBOARD_KEYS.DIGITS)) {
        e.preventDefault();
        const value = e.code.split("Digit")?.[1];
        e.target.value = value;
        moveToNextInputBox(elementId);
    }
};

const extractSiblingId = (currentId, siblingSide) => {
    if (siblingSide === RIGHT) {
        return currentId.split("-")[0] + "-" + Number(+currentId.split("-")[1] + 1);
    } else if (siblingSide === LEFT) {
        return currentId.split("-")[0] + "-" + Number(+currentId.split("-")[1] - 1);
    }
};

const moveToNextInputBox = (currentId) => {
    if (Number(currentId.split("-")?.[1]) === 5) return;

    const nextElementId = extractSiblingId(currentId, RIGHT);
    const nextElement = document.getElementById(nextElementId);
    nextElement.focus();
};

const moveToPreviousInputBox = (currentId) => {
    if (Number(currentId.split("-")?.[1]) === 1) return;

    const prevElementId = extractSiblingId(currentId, LEFT);
    const prevElement = document.getElementById(prevElementId);
    prevElement.focus();
};

const getElementAndId = (e) => {
    if (e.target.className === INPUT_CLASS) {
        const element = e.target;
        const elementId = e.target.id;

        return {
            element,
            elementId,
        };
    }
};
const handleInputChange = (e, elementId) => {

    const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    if (e?.data) {
        if (e?.data?.length > 1) return;
        const value = e.target.value;
        const regex = /^[0-9]?$/;

        if (!regex.test(value)) {
            e.target.value = value.slice(0, -1);
            // Remove the last entered character if it's not numeric
            if (nums.includes(value)) moveToNextInputBox(elementId);
        }
        if (nums.includes(value)) moveToNextInputBox(elementId);
    }
};

const handlePasting = (event, pasteText, elementId) => {
    const startIndex = Number(elementId?.split("-")[1]);

    const requiredELements = [];
    for (i = startIndex; i <= 5; i++) {
        const ele = document.getElementById(`input-${i}`);
        requiredELements.push(ele);
    }
    requiredELements.forEach((ele, index) => {
        if (pasteText[index]) {
            ele.value = pasteText[index];
            moveToNextInputBox(ele?.id);
        }
    });
};

const showInputError = (e) => {
    e.stopPropagation();
    const errorElement = document.querySelector(".error");
    errorElement.textContent =
        "Please Enter a valid Input, Only Numeric Values are allowed!";
};
inputContainer.addEventListener(
    "input",
    (e) => {
        const { element, elementId } = getElementAndId(e);
        handleInputChange(e, elementId);
        element.addEventListener("keydown", (e) => {
            handleKeydown(e, elementId);
        });
    },

    true
);

inputContainer.addEventListener(
    "paste",
    (e) => {
        const { element, elementId } = getElementAndId(e);
        const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let pasteText = (e.clipboardData || window?.clipboardData).getData("text");
        e.preventDefault();

        // if pasted content has alphabets, we dont allow pasting and show a warning
        // message that alphabets not allowed.
        const errorInString =
            pasteText
                .split("")
                .map((ele) => nums.includes(ele))
                .filter((ele) => !ele).length > 0;

        pasteText
            .split("")
            .filter((ele) => ele)
            .forEach((ele) => {
                if (!nums.includes(ele)) {
                    showInputError(e);
                }
            });

        if (!errorInString) handlePasting(e, pasteText, elementId);
    },
    true
);

clearButton.addEventListener('click', () => {
    document.querySelectorAll('.input-box').forEach(ele => ele.value = "");
    firstBox.focus();
})