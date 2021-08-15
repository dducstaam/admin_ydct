import { useState, useEffect } from 'react';
import qs from 'qs';
import history from 'utils/history';

export const useFilter = ({ getData, location, convertQueryToFilter }) => {
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    const newFilter = convertQueryToFilter(params);

    setFilter(newFilter);
    getData(params);
  }, [location.search, location.pathname]);

  const handleSearch = (values) => {
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    history.replace({
      pathname: location.pathname,
      search: `?${qs.stringify({
        ...params,
        ...values,
        page: values.page > 1 ? values.page : 1,
      })}`,
    });
  };

  return { filter, handleSearch };
};

let timeout;

export const useSearchKeyword = ({ text, handleSearch }) => {
  const [keyword, setKeyword] = useState(text || '');

  useEffect(() => {
    if (text !== keyword) {
      setKeyword(text);
    }
  }, [text]);

  const handleChangeKeyword = (value) => {
    setKeyword(value);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  return [keyword, handleChangeKeyword];
};
