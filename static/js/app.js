function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url =  `/metadata/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
    
  d3.json(url).then(function(response) {

    console.log(response)
 
  // Use d3 to select the panel with id of `#sample-metadata`
  panel = d3.select('#sample-metadata')

  
    // Use `.html("") to clear any existing metadata

  panel.html("");

  trow = panel.append("tr");
  trow.append("td").text(`Age: ${response.AGE} `);
  
  if (response.BBTYPE === "I"){
    panel.append("tr").append("td").text(`Belly Button Type: Innie `)
  }
  else {
    panel.append("tr").append("td").text(`Belly Button Type: Outie `)
  }

  panel.append("tr").append("td").text(`Ethnicity ${response.ETHNICITY}`)

  if (response.GENDER === "F"){
    panel.append("tr").append("td").text(`Gender: Female`)
  }
  else {
    panel.append("tr").append("td").text(`Gender: Male`)
  }

  panel.append("tr").append("td").text(`Location: ${response.LOCATION}`)
})


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url =  `/samples/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
    
  d3.json(url).then(function(response) {

    otu_ids = response.otu_ids
    sample_values = response.sample_values
    labels = response.otu_labels
    original_values = sample_values



    var belly_button = [];

    for (i = 0; i < otu_ids.length; i++) {
      belly_button.push([otu_ids[i], sample_values[i], labels[i]]);
    }


    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      y: sample_values,
      x: otu_ids,
      mode: 'markers',
      text: labels,
      marker: {
        size: sample_values,
        colorscale: [[0,'blue'], [1,'red']],
        color: otu_ids,
        colorbar: {}
      }
    };

    data = [trace1]

    var layout = {
      title: `${sample} Data`,
      'height' : 500,
      'width' : 1000,
      xaxis: {
        title: `OTU_IDs`
      }
    }
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
   
    top10 = belly_button.sort(function(a, b){return b-a}).slice(0,10);


    final_ids = []
    final_labels = []
    final_values = []

    for (i = 0; i < otu_ids.length; i++) {
      final_ids.push(top10[i][0]);
      final_values.push(top10[i][1]);
      final_labels.push(top10[i][2]);
    } 

    var pie_data = [{
      values: [final_values],
      labels: [final_labels],
      type: 'pie'
    }];
    
    var pie_layout = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', pie_data, pie_layout);

  });
};




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
