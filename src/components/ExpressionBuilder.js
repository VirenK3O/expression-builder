import React, { useState, useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ExpressionBuilder = () => {
    const [parameter, setParameter] = useState('');
    const [expression, setExpression] = useState([]);
    const [savedExpression, setSavedExpression] = useState('');
    const textareaRef = useRef(null);
    const [isValid, setIsValid] = useState(true);
    const [constant, setConstant] = useState('');

    const parameters = ['age', 'salary', 'income', 'debt'];
    const operators = ['+', '-', '*', '/', '%', '(', ')'];
    const conditionOperators = ['=', '>', '<', 'AND', 'OR']

    const handleParameterChange = (event) => {
        const selectedParameter = event.target.value;
        setParameter(selectedParameter);
    };

    const handleAddParameter = () => {
        insertAtCursor(parameter);
        setParameter('');
    };

    const handleAddOperator = (operator) => {
        insertAtCursor(operator);
    };

    const handleAddConditionOperator = (conditionOperator) => {
        insertAtCursor(conditionOperator);
    }

    const handleConstantChange = (event) => {
        const selectedConstant = event.target.value;
        setConstant(selectedConstant);
    }

    const handleAddConstant = () => {
        const constantValue = document.getElementById('constant-input').value;
        insertAtCursor(constantValue);
        setConstant('');
    };
    

    const insertAtCursor = (value) => {
        const cursorPosition = textareaRef.current.selectionStart;
        const currentExpression = expression;
        const updatedExpression =
            currentExpression.slice(0, cursorPosition) +
            value +
            currentExpression.slice(cursorPosition);
        setExpression(updatedExpression);
        textareaRef.current.value = updatedExpression;
        textareaRef.current.selectionStart = cursorPosition + value.length;
        textareaRef.current.selectionEnd = cursorPosition + value.length;
        textareaRef.current.focus();
    };

    const handleTextAreaFocus = () => {
        textareaRef.current.readOnly = false;
    };

    const handleDelete = () => {
        const cursorPosition = textareaRef.current.selectionStart;
        if (cursorPosition === 0) {
            return;
        }
    
        const currentExpression = expression;
    
        // Find the start and end positions of the word before the cursor.
        let start = cursorPosition - 1;
        while (start >= 0 && /[a-zA-Z_]/.test(currentExpression.charAt(start))) {
            start--;
        }
        start++; // Adjust the start position to the beginning of the word.
    
        let end = cursorPosition;
        while (end < currentExpression.length && /[a-zA-Z_]/.test(currentExpression.charAt(end))) {
            end++;
        }
    
        // Remove the parameter if it's detected before the cursor.
        const wordBeforeCursor = currentExpression.slice(start, end);
        if ((parameters.includes(wordBeforeCursor)) || operators.includes(wordBeforeCursor) || conditionOperators.includes(wordBeforeCursor)){
            const updatedExpression =
                currentExpression.slice(0, start) + currentExpression.slice(end);
            setExpression(updatedExpression);
            textareaRef.current.value = updatedExpression;
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd = start;
        }
         else {
            // If the word before the cursor is not a parameter, simply delete one character.
            const updatedExpression =
                currentExpression.slice(0, cursorPosition - 1) + currentExpression.slice(cursorPosition);
            setExpression(updatedExpression);
            textareaRef.current.value = updatedExpression;
            textareaRef.current.selectionStart = cursorPosition - 1;
            textareaRef.current.selectionEnd = cursorPosition - 1;
        }
    
        textareaRef.current.focus();

    };
    

    const handleSaveExpression = () => {
        // Save the expression here, you can store it in state, send it to a server, etc.
        // For example, storing it in the component's state:
        // savedExpression is a state variable to store the saved expression.
        setSavedExpression(expression);

        // After saving, validate the expression
        validateExpression();
        setExpression([]);
    };
    
    const validateExpression = () => {
        // Regular expression to validate mathematical expressions with balanced parentheses
        const regex = /^[a-zA-Z0-9+\-*/%()\[\]=<>!&|*]+$/;

    
        if (regex.test(expression)) {
            const stack = [];
            let prevChar = ''; // Track the previous character to check for consecutive operators
            let isPrevCharOperator = false; // Track if the previous character was an operator
    
            for (let char of expression) {
                if (char === '(' || char === '[') {
                    stack.push(char);
                } else if (char === ')' || char === ']') {
                    if (stack.length === 0 || !areMatchingBrackets(stack.pop(), char)) {
                        setIsValid(false);
                        return;
                    }
                } else if (isOperator(char)) {
                    if (isPrevCharOperator) {
                        setIsValid(false);
                        return;
                    }
                    isPrevCharOperator = true;
                } else {
                    isPrevCharOperator = false;
                }
                prevChar = char;
            }
    
            if (stack.length === 0) {
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        } else {
            setIsValid(false);
        }
    };    
    
    
    const isOperator = (char) => operators.includes(char);

    const areMatchingBrackets = (open, close) =>
        (open === '(' && close === ')') ||
        (open === '[' && close === ']');

    return (
        <div className="container">
            <div className="textarea">
                <textarea
                    ref={textareaRef}
                    value={expression}
                    onChange={() => {}}
                    // readOnly
                    onClick={handleTextAreaFocus}
                    className="form-control"
                    style={{ width: '500px', height: '300px' }}
                />
                <div className="save-btn">
                    <button className="btn btn-primary" onClick={handleSaveExpression}>Save</button>
                    {isValid === true && <div>Expression is valid</div>}
                    {isValid === false && <div>Expression is invalid</div>}
                </div>
            </div>
            <div className="parameters">
                <div className="parameters-2">
                    <select
                        value={parameter}
                        onChange={handleParameterChange}
                        className="form-select"
                        style={{ width: '150px' }}
                    >
                        <option value="" disabled>
                            Parameters
                        </option>
                        {parameters.map((param) => (
                            <option key={param} value={param}>
                                {param}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={handleAddParameter}>
                        Add
                    </button>
                </div>
                <div className="button-wrapper">
                    {operators.map((operator) => (
                        <button
                            key={operator}
                            className="btn btn-secondary"
                            onClick={() => handleAddOperator(operator)}
                        >
                            {operator}
                        </button>
                    ))}
                </div>
                <div className='conditional'>
                {conditionOperators.map((conditionOperator) => (
                        <button
                             key={conditionOperator}
                            className="btn btn-secondary"
                            onClick={() => handleAddConditionOperator(conditionOperator)}
                        >
                            {conditionOperator}
                        </button>
                    ))}
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
                <div className="content-wrapper">
                    <input
                        id="constant-input"
                        type="text"
                        value={constant}
                        onChange={handleConstantChange}
                        className="form-control"
                        style={{ height: '50px', width: '207px' }}
                    />
                    <button className="btn btn-primary" onClick={handleAddConstant}>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpressionBuilder;



