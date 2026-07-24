import React from 'react';
import { Sun, CloudRain, CloudSun, Wind, MapPin, Thermometer, Droplets, ShieldAlert } from 'lucide-react';
import { WeatherData } from '../types';
import { CITIES_WEATHER } from '../data/mockData';

interface WeatherWidgetProps {
  weather: WeatherData;
  setWeather: (weather: WeatherData) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, setWeather }) => {
  const cities = Object.keys(CITIES_WEATHER);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-7 h-7 text-amber-500 animate-spin-slow" />;
      case 'CloudRain': return <CloudRain className="w-7 h-7 text-blue-500" />;
      case 'Wind': return <Wind className="w-7 h-7 text-teal-500" />;
      case 'CloudSun': default: return <CloudSun className="w-7 h-7 text-amber-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-700/50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Location & Main Weather */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            {getWeatherIcon(weather.icon)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-indigo-200 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>도시 선택:</span>
              </div>
              <select
                id="select-weather-city"
                value={weather.city}
                onChange={(e) => {
                  const selectedCity = e.target.value;
                  if (CITIES_WEATHER[selectedCity]) {
                    setWeather(CITIES_WEATHER[selectedCity]);
                  }
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg px-2 py-0.5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-stone-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight">{weather.temp}°C</span>
              <span className="text-sm font-medium text-indigo-100">{weather.condition}</span>
            </div>
          </div>
        </div>

        {/* Middle: Weather details badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-amber-300" />
            <span>최고 {weather.highTemp}° / 최저 {weather.lowTemp}°</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-300" />
            <span>습도 {weather.humidity}%</span>
          </div>
        </div>
      </div>

      {/* Weather Dressing Tip */}
      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-indigo-100/90">
        <ShieldAlert className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-white">오늘의 스타일링 가이드: </span>
          {weather.dressingTip}
        </p>
      </div>
    </div>
  );
};
