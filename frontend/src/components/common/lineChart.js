import React, { useState } from "react";
import { Chart } from "react-google-charts";

export function LineChart(props) {
  const options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: props.label,
    },
    series: {
      1: { curveType: "function" },
    },
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={props.data}
      options={options}
    />
  );
}
