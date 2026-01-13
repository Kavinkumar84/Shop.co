import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CountryDropdown = ({ value, onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,idd,flags")
      .then((res) => {
        const data = res.data
          .filter((c) => c.idd?.root)
          .map((c) => {
            const code = `${c.idd.root}${c.idd.suffixes?.[0] || ""}`;
            const num = Number(code.replace("+", ""));

            return num < 1000
              ? {
                name: c.name.common,
                code,
                flag: c.flags.svg,
              }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    setFiltered(
      countries.filter(
        (c) =>
          c.name.toLowerCase().startsWith(search.toLowerCase()) ||
          c.code.includes(search)
      )
    );
  }, [search, countries]);

  useEffect(() => {
    const handler = (e) => !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="country-dropdown" ref={ref} style={{ pointerEvents: 'auto', zIndex: 1 }}>
      <div
        className="input-box input-country"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{ cursor: 'pointer', overflow: 'hidden' }}
      >
        <input value={value} readOnly style={{ cursor: 'pointer', width: '100%' }} />
      </div>

      {open && (
        <div className="country-menu">
          <input
            ref={searchInputRef}
            className="country-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 && (
            <div className="no-country">No countries found</div>
          )}

          {filtered.map((c, i) => (
            <div
              key={i}
              className="country-item"
              onClick={() => {
                onSelect(c.code);
                setOpen(false);
                setSearch("");
              }}
            >
              <img src={c.flag} alt="" />
              <span>{c.name}</span>
              <div className=" fs-6">{c.code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
