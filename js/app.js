let baseURL =``;
let apiKey=``;
let queryType = ``;
let titleQuery = ``;
let queryURL = ``;  

 $(()=>{
//defining localStorage   
if(localStorage.count==null)
  {
      localStorage.setItem("count",0);  
   }

console.log("I am at before ajax!");
var cityData;
getCityData();
function getCityData()
{
    //API to get the list of 100 cities
    baseURL =`https://dataservice.accuweather.com`;
    apiKey=`?apikey=sAAYnkGDdR4uGyMkbQx7MnxgDXAs1oLR`;
    queryType = `/locations/v1/topcities/`;
    titleQuery = `100`;//$("#cities").val();
    queryURL = baseURL + queryType + titleQuery + apiKey; 

    $.ajax({
      url: queryURL
    }).then((cities)=>{
      cityData = cities;
      console.log(cityData);
    },
      (error)=>{
        console.log(error)
      });

    //sorting cities data  
    setTimeout(()=>
                {
                    cityData.sort(function(a,b){
                    var nameA = a.EnglishName.toUpperCase();
                    var nameB = b.EnglishName.toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                  
                    // names must be equal
                    return 0;
                  });

                    console.log(cityData);
                  
                    //Populating the dropdown of cities
                  for(i=0;i<cityData.length;i++)
                  {
                    $option = $("<option>").html(`${cityData[i].EnglishName}`);
                    $option.attr("value",cityData[i].EnglishName);
                    $("#cities").append($option);

                  }
              }, 100);
};

//search button logic
$("#search").on("click",function(event){
  event.preventDefault();
  console.log("I am inside onclick");
  $("#results").css("display","none");
  getCityData();
  getData();
  setTimeout(()=>{$(".loading").css("display","none");
                    $("#results").css("display","block");
                  },6000);
});


const getData = () => {
  $(".loading").css("display","block");
  localStorage.count+=1;
  localStorage.setItem(`search_${localStorage.count}`,$("#cities").val());
  var newsData;
  var giphyData;
  var weatherData;
 //News API - New York Times
 baseURL =`https://api.nytimes.com/svc/search/v2/articlesearch.json`;
 apiKey=`&api-key=CToDJ8Mw4A2LtQLGhxE4xtG17dRisE2J`;
 queryType = `?q=`;
 titleQuery = $("#cities").val();
 queryURL = baseURL + queryType + titleQuery + apiKey;  
 
 $.ajax({
    url: queryURL
  }).then((news) => {
   newsData = news;
    setTimeout(console.log(newsData),1000);
     }, (error) => {
    console.error(error);
  }); 


  //GIPHY API
  baseURL =`https://api.giphy.com/v1/gifs/search`;
  apiKey=`&api_key=Y6P1j5JAEJA8WX5fE6rbfa7rFbRGEHnn`;
  queryType = `?q=`;
  titleQuery = $("#cities").val();
  queryURL = baseURL + queryType + titleQuery + apiKey; 
  $.ajax({
    url: queryURL
  }).then((giphy) => {
   giphyData = giphy;
    //setTimeout(console.log(giphyData.data[0].images.fixed_height.url),2000);
    setTimeout(console.log(giphyData.data[0]),1000);
    
  }, (error) => {
    console.error(error)
  });
  
  //Weather API - Accuweather
  baseURL =`https://dataservice.accuweather.com`;
  apiKey=`?apikey=sAAYnkGDdR4uGyMkbQx7MnxgDXAs1oLR`;
  queryType = `/forecasts/v1/daily/5day/`;
  titleQuery = cityData[cityData.findIndex((value, index, array)=>{if (array[index].EnglishName == $("#cities").val())
                                                                    return index;
                                                                  })].Key;
/*   console.log($("#cities").val());
  console.log(cityData[cityData.findIndex((value, index, array)=>{
                                                                  console.log(array[index].EnglishName); 
                                                                  if (array[index].EnglishName == $("#cities").val())
                                                                    return index;
                                                                  }
                                          )
                      ].Key
            ); */
  queryURL = baseURL + queryType + titleQuery + apiKey; 
  $.ajax({
    url: queryURL
  }).then((cities) => {
   weatherData = cities;
    setTimeout(console.log(weatherData.DailyForecasts),1000);
  }, (error) => {
    console.error(error);
  });
setTimeout(()=>{
  $("#weather-div").empty();
  $("#news-div").empty();
    
  for(i=0;i<5;i++){
    //const img = giphyData.data[i].images.fixed_height.url;
    //const $giphyDiv = $(`<img class="img-giphy">`).attr("src",img);

    const date = new Date(weatherData.DailyForecasts[i].Date).toString().substring(0,10);
    const dayWeather = weatherData.DailyForecasts[i].Day.IconPhrase;
    const maxTemp = weatherData.DailyForecasts[i].Temperature.Maximum.Value + "F";
    const minTemp = weatherData.DailyForecasts[i].Temperature.Minimum.Value + "F";
    const nightWeather = weatherData.DailyForecasts[i].Night.IconPhrase;
    //const $weatherDiv = $("<div>").html(`<tr><td>${dayWeather}</td><td>${maxTemp}</td><td>${minTemp}</td></tr>`);
    
    const newsLink = newsData.response.docs[i].web_url;
    const newsHeader = newsData.response.docs[i].headline.main;
    const leadParagraph = newsData.response.docs[i].lead_paragraph;
    const $newsDiv = $("<div>").html(`<strong>${i+1}</strong> <a href='${newsLink}'>${newsHeader}</a><p>${leadParagraph}</p><br>`);
 
    // $("#giphy").append($giphyDiv);
     $("#weather-div").append(`<div class="weather-div"> <div class="weather-date">${date}</div>  <br><div>${maxTemp}/${minTemp}</div><br>  <div>${dayWeather} in the day. </div><br><div>${nightWeather} in the night.</div><br><br></div>`);
     $("#news-div").append($newsDiv);
    }
    
    if(giphyData){
      $("#giphy-div").empty();
      for(i=0;i<25;i++){
        const img = giphyData.data[i].images.fixed_height.url;
        const $giphyDiv = $(`<img class="img-giphy">`).attr("src",img);
        $("#giphy-div").append($giphyDiv);
        }
    }

},2000);


};
console.log("I am at after ajax!");
console.log($("#cities").val());

//carousel logic
var imgNumber = 1;

$("#img1").css("display","block");
$("#next").on("click",nextClick);
$("#prev").on("click",prevClick);

for(i=1;i<5;i++){
  setTimeout(nextClick,2000*i);
  console.log("in carousel animation loop - " + i);
}

//carousel next button click function
function nextClick(){
  var imagId = "#img"
  
  if (imgNumber < 4)
  imgNumber+=1;

  else
  imgNumber=1;

  imagId+=imgNumber;
  $(".img-carousel").css("display", "none");
  $(`${imagId}`).css("display","block");
  //console.log("changed image to " + imgNumber);

}

//carousel prev button click function
function prevClick(){
  var imagId = "#img"
  
  if (imgNumber > 1)
  imgNumber-=1;

  else
  imgNumber=4;

  imagId+=imgNumber;
  $(".img-carousel").css("display", "none");
  $(`${imagId}`).css("display","block");
  //console.log("changed image to " + imgNumber);

}
var string="search_0";
for(i=0;i<localStorage.length-1;i++){
  string+="1";
  console.log(localStorage.getItem(string));
}

});


