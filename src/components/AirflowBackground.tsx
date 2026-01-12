export function AirflowBackground() {
  return (
    <svg
      aria-hidden="true"
      className="airflow-mask pointer-events-none absolute inset-0 h-full w-full opacity-35 sm:opacity-45"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="airflowStroke"
          x1="0"
          y1="0"
          x2="1200"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="0.18" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="0.82" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="airflow-layer airflow-layer--a">
        <path
          className="airflow-path airflow-path--1"
          d="M-200 120 C 80 40, 260 210, 520 130 C 760 55, 950 95, 1400 35"
          fill="none"
          stroke="url(#airflowStroke)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="airflow-path airflow-path--2"
          d="M-200 210 C 60 150, 280 310, 540 230 C 780 155, 980 235, 1400 170"
          fill="none"
          stroke="url(#airflowStroke)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="airflow-path airflow-path--3"
          d="M-200 310 C 70 240, 250 420, 520 340 C 770 270, 980 340, 1400 290"
          fill="none"
          stroke="url(#airflowStroke)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      <g className="airflow-layer airflow-layer--b">
        <path
          className="airflow-path airflow-path--4"
          d="M-200 160 C 40 110, 300 260, 560 185 C 820 115, 980 145, 1400 95"
          fill="none"
          stroke="url(#airflowStroke)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          className="airflow-path airflow-path--5"
          d="M-200 380 C 90 305, 260 520, 560 420 C 820 330, 980 420, 1400 360"
          fill="none"
          stroke="url(#airflowStroke)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
