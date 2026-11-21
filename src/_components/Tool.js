"use client"
import { useState, useEffect, useRef } from "react";
import styles from "./Tool.module.css";
import { Noto_Sans_Symbols, Montserrat } from "next/font/google";

const notoSansSymbols = Noto_Sans_Symbols({
    weight: ["400"]
});

const montserrat = Montserrat({
    weight: ["400", "500", "600", "700", "800"]
});

export default function Tool() {
    const [stage, updateStage] = useState(0);
    const [decisionName, updateDecisionName] = useState("");
    const [options, updateOptions] = useState([""]);
    const [criteria, updateCriteria] = useState([""]);
    const [criteriaPolarity, updateCriteriaPolarity] = useState([true]);
    const [criteriaEvaluations, updateCriteriaEvaluations] = useState([]);

    useEffect(() => {
        if (stage == 3) {
            let tempCriteriaEvaluations = [];
            criteria.map((i, n) => {
                let tempArr = [];
                options.forEach((ii, nn) => tempArr[nn] = 5);
                tempCriteriaEvaluations[n] = tempArr;
            });
            updateCriteriaEvaluations(tempCriteriaEvaluations);
        }
    }, [stage]);

    useEffect(() => {
        if (stage == 3) {
            updateStage(4);
        }
    }, [criteriaEvaluations]);

    function Option({ optionName, optionCriteriaEvals }) {
        return (
            <div style={{
                boxShadow: "0px 0px 10px 5px lavender",
                padding: "20px",
                borderRadius: "20px",
                margin: "20px"
            }}>
                <h3>{optionName}</h3>
                {optionCriteriaEvals().map((i, n) => 
                    <div key={n}>
                        <p style={{
                            marginBottom: "0"
                        }}><span style={{
                            color: criteriaPolarity[n] ? "darkgreen" : "darkred",
                            fontWeight: "500"
                        }}><span className={notoSansSymbols.className}>{criteriaPolarity[n] ? "☺" : "☹"}</span> {criteria[n]}:</span></p>
                        <meter max="10" min="0" low={criteriaPolarity[n] ? 3 : 2} high={criteriaPolarity[n] ? 8 : 7} optimum={criteriaPolarity[n] ? 10 : 0} value={optionCriteriaEvals()[n]} style={{
                            marginTop: "0"
                        }}></meter>
                    </div>
                )}
            </div>
        );
    }

    function determineBestOptions() {
        let scores = [];
        let bestScore = null;
        options.forEach((i, n) => {
            let overallScore = 0;
            criteria.forEach((ii, nn) => {
                overallScore = overallScore + Number(criteriaPolarity[nn] ? criteriaEvaluations[nn][n] : -1*(criteriaEvaluations[nn][n]));
            });
            if (overallScore > bestScore || bestScore == null) {
                bestScore = overallScore;
            }
            scores.push(overallScore);
        });

        let tiedOptions = [];
        options.forEach((i, n) => {
            if (scores[n] == bestScore) {
                tiedOptions.push(n);
            }
        });

        if (tiedOptions.length > 1) {
            for (let n in criteria) {
                let currentHigh = criteriaPolarity[n] ? -1 : 11;
                let theseScores = [];
                for (let nn of tiedOptions) {
                    theseScores.push(criteriaEvaluations[n][nn]);
                    if (criteriaPolarity[n] ? (criteriaEvaluations[n][nn] > currentHigh) : (criteriaEvaluations[n][nn] < currentHigh)) {
                        currentHigh = criteriaEvaluations[n][nn];
                    }
                }

                let tiedScores = [];
                tiedOptions.forEach((n) => {
                    if (theseScores[n] == currentHigh) {
                        tiedScores.push(n);
                    }
                });

                if (tiedScores.length == 1) {
                    return options[tiedScores[0]];
                } else {
                    if (n == (criteria.length - 1)) {
                        return <><span style={{fontWeight: "400"}}>it's a tie between these: </span><span style={{fontWeight: "600"}}>{(tiedScores.map((i, n) => options[n])).toString()}</span></>;
                    }
                }
            }
        } else {
            return options[tiedOptions[0]];
        }
    }

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
                <input value={decisionName} onChange={e => updateDecisionName(e.target.value)} type="text" className={montserrat.className} />
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
                    <h3 style={{
                        marginTop: "0",
                        fontWeight: "600"
                    }}>Make sure to put them in priority order!</h3>
                    {criteria.map((i, n) => {
                        return <div key={n} style={{
                            display: "flex",
                            gap: "20px"
                        }}>
                            <label htmlFor={n} style={{
                                fontWeight: "500",
                                marginTop: "auto",
                                marginBottom: "auto",
                                marginRight: "0"
                            }}>#{n+1}</label>
                            <input type="text" value={i} onChange={e => {
                                let tempCriteria = criteria.slice();
                                tempCriteria.splice(n, 1, e.target.value);
                                updateCriteria(tempCriteria);
                            }} className={montserrat.className} id={n} />
                            <div style={{
                                display: "flex"
                            }}>
                                <input type="radio" name={n} className={`${styles.icon} ${styles.smile} ${notoSansSymbols.className}`} checked={criteriaPolarity[n]} onChange={(e) => {
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
                                <div key={n.toString().concat(nn)} style={{
                                    display: "flex",
                                    flexFlow: "column wrap",
                                    alignItems: "end"
                                }}>
                                    <div>
                                        <label htmlFor={n.toString().concat(nn)}>{ii}</label>
                                        <input type="range" min="0" max="10" value={criteriaEvaluations[n][nn]} onChange={e => {
                                            let tempCriteriaEvaluations = criteriaEvaluations.slice();
                                            tempCriteriaEvaluations[n][nn] = e.target.value;
                                            updateCriteriaEvaluations(tempCriteriaEvaluations);
                                        }} id={n.toString().concat(nn)} list={"list".concat(i.toString().concat(ii.toString()))} style={{
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
                    <h3 style={{
                        marginBottom: "0",
                        marginTop: "0",
                        fontWeight: "600"
                    }}>{decisionName}</h3>
                    <h3 style={{
                        marginTop: "0"
                    }}><span style={{
                        fontWeight: "600"
                    }}>Best Option: </span>{determineBestOptions()}</h3>
                    <div style={{
                        display: "flex",
                        flexFlow: "row wrap"
                    }}>
                        {options.map((i, n) => <Option optionName={i} key={n} optionCriteriaEvals={() => {
                            let tempOptionCriteriaEvals = [];
                            criteria.forEach((ii, nn) => {
                                tempOptionCriteriaEvals[nn] = criteriaEvaluations[nn][n];
                            });
                            return tempOptionCriteriaEvals;
                        }} criteriaPolarity={criteriaPolarity} />)}
                    </div>
                </>
            : null))))}
            {stage < 5 ?
                <button onClick={() => {
                    updateStage(stage + 1);
                }} className={`${montserrat.className} primaryButton`}>Next</button>
            : null}
        </div>
    );
}
