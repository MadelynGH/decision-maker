"use client"
import { useState, useEffect } from "react";
import styles from "./Tool.module.css";

export default function Tool() {
    const [stage, updateStage] = useState(0);
    const [decisionName, updateDecisionName] = useState("");
    const [options, updateOptions] = useState([""]);
    const [criteria, updateCriteria] = useState([""]);
    const [criteriaEvaluations, updateCriteriaEvaluations] = useState({});

    useEffect(() => {
        if (stage == 3) {
            let tempCriteriaEvaluations = {};
            criteria.map(i => {
                let tempObj = {};
                options.map(ii => tempObj[ii] = 5);
                tempCriteriaEvaluations[i] = tempObj;
            });
            updateCriteriaEvaluations(tempCriteriaEvaluations);
        }
    }, [stage]);

    useEffect(() => {
        if (stage == 3) {
            updateStage(4);
        }
    }, [criteriaEvaluations]);

    return (
        <div style={{
            border: "1px solid indigo",
            borderRadius: "8px",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "25px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "25px"
        }}>
            {stage == 0 ?
            <>
                <h2 className={styles.prompt}>What decision are you trying to make?</h2>
                <input value={decisionName} onChange={e => updateDecisionName(e.target.value)} />
            </>
            : (stage == 1 ?
            <>
                <h2 className={styles.prompt}>What are your options?</h2>
                {options.map((i, n) => {
                    return <input value={i} onChange={e => {
                        let tempOptions = options.slice();
                        tempOptions.splice(n, 1, e.target.value);
                        updateOptions(tempOptions);
                    }} key={n} />;
                })}
                <button onClick={() => {
                    let tempOptions = options.slice();
                    tempOptions.push("");
                    updateOptions(tempOptions);
                }}>+ Add</button>
            </>
            : (stage == 2 ?
                <>
                    <h2 className={styles.prompt}>What are your criteria?</h2>
                    {criteria.map((i, n) => {
                        return <input value={i} onChange={e => {
                            let tempCriteria = criteria.slice();
                            tempCriteria.splice(n, 1, e.target.value);
                            updateCriteria(tempCriteria);
                        }} key={n} />;
                    })}
                    <button onClick={() => {
                        let tempCriteria = criteria.slice();
                        tempCriteria.push("");
                        updateCriteria(tempCriteria);
                    }}>+ Add</button>
                </>
            : (stage == 4 ?
                <>
                    <h2 className={styles.prompt}>Time to evaluate each criteria.</h2>
                    {criteria.map((i, n) => (
                        <div key={i.concat(n)}>
                            <h3>{i}</h3>
                            {options.map((ii, nn) => (
                                <div key={ii.concat(nn)} style={{
                                    display: "flex",
                                    flexFlow: "column wrap",
                                    alignItems: "end"
                                }}>
                                    <div>
                                        <label htmlFor={i.toString().concat(ii.toString())}>{ii}</label>
                                        <input type="range" min="0" max="10" value={criteriaEvaluations[i][ii]} onChange={e => {
                                            let tempCriteriaEvaluations = {...criteriaEvaluations};
                                            tempCriteriaEvaluations[i][ii] = e.target.value;
                                            updateCriteriaEvaluations(tempCriteriaEvaluations);
                                        }} id={i.toString().concat(ii.toString())} list={"list".concat(i.toString().concat(ii.toString()))} style={{
                                            width: "150px"
                                        }} />
                                    </div>
                                    <datalist id={"list".concat(i.toString().concat(ii.toString()))} style={{
                                        display: "flex",
                                        flexFlow: "row nowrap",
                                        justifyContent: "space-between",
                                        width: "150px",
                                        fontSize: "0.6em"
                                    }}>
                                        <option value="0" label="0"></option>
                                        <option value="1"></option>
                                        <option value="2"></option>
                                        <option value="3"></option>
                                        <option value="4"></option>
                                        <option value="5" label="5"></option>
                                        <option value="6"></option>
                                        <option value="7"></option>
                                        <option value="8"></option>
                                        <option value="9"></option>
                                        <option value="10" label="10"></option>
                                    </datalist>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            : null)))}
            {stage < 4 ?
                <button onClick={() => updateStage(stage + 1)}>Next</button>
            : null}
        </div>
    );
}