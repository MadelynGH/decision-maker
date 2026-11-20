"use client"
import { useState, useEffect } from "react";
import styles from "./Tool.module.css";
import { Noto_Sans_Symbols, Montserrat } from "next/font/google";

const notoSansSymbols = Noto_Sans_Symbols({
    weight: ["400"]
});

const montserrat = Montserrat({
    weight: ["400", "500", "600", "700", "800"]
});

function Option({ optionName, optionCriteriaEvals, criteriaPolarity }) {
    return (
        <div style={{
            boxShadow: "0px 0px 10px 5px lightblue",
            padding: "20px",
            borderRadius: "20px",
            margin: "20px"
        }}>
            <h4>{optionName}</h4>
            {Object.keys(optionCriteriaEvals()).map((i, n) => 
                <p key={n}><span style={{
                    fontWeight: "500"
                }}>{i}:</span> <span style={{
                    color: criteriaPolarity[n] ? "green" : "darkred"
                }}>{optionCriteriaEvals()[i]}</span></p>
            )}
        </div>
    );
}

export default function Tool() {
    const [stage, updateStage] = useState(0);
    const [decisionName, updateDecisionName] = useState("");
    const [options, updateOptions] = useState([""]);
    const [criteria, updateCriteria] = useState([""]);
    const [criteriaPolarity, updateCriteriaPolarity] = useState([true]);
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
                <input value={decisionName} onChange={e => updateDecisionName(e.target.value)} type="text" />
            </>
            : (stage == 1 ?
            <>
                <h2 className={styles.prompt}>What are your options?</h2>
                {options.map((i, n) => {
                    return <input type="text" value={i} onChange={e => {
                        let tempOptions = options.slice();
                        tempOptions.splice(n, 1, e.target.value);
                        updateOptions(tempOptions);
                    }} key={n} className={montserrat.className} />;
                })}
                <button onClick={() => {
                    let tempOptions = options.slice();
                    tempOptions.push("");
                    updateOptions(tempOptions);
                }} className={`${montserrat.className} secondaryButton`}>+ Add</button>
            </>
            : (stage == 2 ?
                <>
                    <h2 className={styles.prompt}>What are your criteria?</h2>
                    {criteria.map((i, n) => {
                        return <div key={n} style={{
                            display: "flex",
                            gap: "20px"
                        }}>
                            <input type="text" value={i} onChange={e => {
                                let tempCriteria = criteria.slice();
                                tempCriteria.splice(n, 1, e.target.value);
                                updateCriteria(tempCriteria);
                            }} className={montserrat.className} />
                            <div style={{
                                display: "flex"
                            }}>
                                <input type="radio" name={n} className={`${styles.icon} ${styles.smile} ${notoSansSymbols.className}`} checked={criteriaPolarity[n]} onChange={(e) => {
                                    console.log(criteriaPolarity);
                                    let tempCriteriaPolarity = criteriaPolarity.slice();
                                    tempCriteriaPolarity.splice(n, 1, e.target.checked);
                                    updateCriteriaPolarity(tempCriteriaPolarity);
                                }} title="Positive" />
                                <input type="radio" name={n} className={`${styles.icon} ${styles.frown} ${notoSansSymbols.className}`} checked={!criteriaPolarity[n]} onChange={(e) => {
                                    let tempCriteriaPolarity = criteriaPolarity.slice();
                                    tempCriteriaPolarity.splice(n, 1, !e.target.checked);
                                    updateCriteriaPolarity(tempCriteriaPolarity);
                                }} title="Negative" />
                            </div>
                        </div>;
                    })}
                    <button onClick={() => {
                        let tempCriteria = criteria.slice();
                        tempCriteria.push("");
                        updateCriteria(tempCriteria);
                        let tempPolarity = criteriaPolarity.slice();
                        tempPolarity.push(true);
                        updateCriteriaPolarity(tempPolarity);
                    }} className={`${montserrat.className} secondaryButton`}>+ Add</button>
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
            : (stage == 5 ?
                <>
                    <h2 className={styles.prompt}>Let's take a look.</h2>
                    <div style={{
                        display: "flex",
                        flexFlow: "row wrap"
                    }}>
                        {options.map((i, n) => <Option optionName={i} key={n} optionCriteriaEvals={() => {
                            let tempOptionCriteriaEvals = {};
                            criteria.forEach((ii, nn) => {
                                tempOptionCriteriaEvals[ii] = criteriaEvaluations[ii][i];
                            });
                            return tempOptionCriteriaEvals;
                        }} criteriaPolarity={criteriaPolarity} />)}
                    </div>
                </>
            : null))))}
            {stage < 5 ?
                <button onClick={() => updateStage(stage + 1)} className={`${montserrat.className} primaryButton`}>Next</button>
            : null}
        </div>
    );
}