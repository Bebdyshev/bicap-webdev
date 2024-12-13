import React, { useEffect } from 'react';

const WeatherWidget = () => {
  useEffect(() => {
    // Проверка и инициализация параметров виджета
    if (!window.myWidgetParam) {
      window.myWidgetParam = [];
    }

    window.myWidgetParam.push({
      id: 15,
      cityid: '610611', // ID города (например, Ташкент)
      appid: '8da0c20bbcb7207fd95a355463e24668', // Ваш API ключ
      units: 'metric', // Единицы измерения (метрическая система)
      containerid: 'openweathermap-widget-15', // ID контейнера для виджета
    });

    // Динамическое добавление скрипта на страницу
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';

    // Вставляем скрипт в DOM
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    // Очищаем скрипт при размонтировании компонента
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div id="openweathermap-widget-15" style={{position: 'absolute', zIndex: '1010', right: '25px', bottom: '25px'}}></div>
  );
};

export default WeatherWidget;
