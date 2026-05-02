import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ── PAGE CONFIG ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Retail Data Warehouse",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── THEME / GLOBAL CSS ─────────────────────────────────────────────────────────
st.markdown("""
<style>
[data-testid="stSidebar"] {
    background-color: #12121f !important;
}
[data-testid="stSidebar"] * {
    color: rgba(210, 210, 235, 0.75) !important;
}
[data-testid="stSidebar"] h1,
[data-testid="stSidebar"] h2,
[data-testid="stSidebar"] h3 {
    color: #e0e0f5 !important;
}
[data-testid="stSidebar"] .stSelectbox label,
[data-testid="stSidebar"] .stMultiSelect label {
    color: rgba(210,210,235,0.5) !important;
    font-size: 0.72rem !important;
    text-transform: uppercase;
    letter-spacing: 0.07em;
}
[data-testid="stSidebar"] hr {
    border-color: rgba(255,255,255,0.08) !important;
}
[data-testid="stSidebar"] [data-baseweb="select"] > div {
    background-color: rgba(255,255,255,0.06) !important;
    border-color: rgba(255,255,255,0.12) !important;
    color: #c8c8e8 !important;
}
.block-container {
    padding-top: 2.5rem;
    padding-bottom: 2rem;
}
.section-badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: rgba(91,106,240,0.12);
    color: #5b6af0;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 8px;
    margin-top: 4px;
    line-height: 1.6;
}
.section-title {
    font-size: 1.55rem;
    font-weight: 700;
    margin-bottom: 1.4rem;
    margin-top: 2px;
    line-height: 1.25;
    color: #111122;
}
.metric-row { display: flex; gap: 12px; margin-bottom: 1.2rem; }
.metric-card {
    flex: 1;
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    padding: 14px 18px;
}
.metric-card .m-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
    margin-bottom: 6px;
}
.metric-card .m-value {
    font-size: 1.65rem;
    font-weight: 700;
    color: #111122;
    line-height: 1;
}
.metric-card .m-sub {
    font-size: 0.72rem;
    color: #aaa;
    margin-top: 3px;
}
.insight-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.08);
    border-left: 4px solid #5b6af0;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 14px;
}
.insight-card.teal  { border-left-color: #1d9e75; }
.insight-card.amber { border-left-color: #ef9f27; }
.insight-card.pink  { border-left-color: #e05b8a; }
.insight-card h4 {
    font-size: 0.85rem;
    font-weight: 700;
    margin: 0 0 6px;
    color: #111122;
}
.insight-card p {
    font-size: 0.82rem;
    color: #555;
    margin: 0;
    line-height: 1.55;
}
.insight-badge {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 20px;
    margin-bottom: 6px;
}
.badge-revenue  { background: rgba(91,106,240,0.1);  color: #5b6af0; }
.badge-customer { background: rgba(29,158,117,0.1);  color: #1d9e75; }
.badge-product  { background: rgba(239,159,39,0.1);  color: #ef9f27; }
.badge-time     { background: rgba(224,91,138,0.1);  color: #e05b8a; }
</style>
""", unsafe_allow_html=True)

# ── PALETTE ────────────────────────────────────────────────────────────────────
INDIGO = "#5b6af0"
TEAL   = "#1d9e75"
AMBER  = "#ef9f27"
PINK   = "#e05b8a"
PALETTE = [INDIGO, TEAL, AMBER, PINK, "#9b59b6", "#16a085"]

PLOTLY_LAYOUT = dict(
    paper_bgcolor="white",
    plot_bgcolor="white",
    font=dict(family="Inter, sans-serif", size=12, color="#555"),
    margin=dict(l=10, r=10, t=30, b=10),
    xaxis=dict(showgrid=False, linecolor="#e0e0ec", tickcolor="#e0e0ec"),
    yaxis=dict(gridcolor="#f0f0f5", linecolor="#e0e0ec", tickcolor="#e0e0ec"),
    legend=dict(bgcolor="rgba(0,0,0,0)", borderwidth=0),
    hoverlabel=dict(bgcolor="white", bordercolor="#e0e0ec", font_size=12),
)

def apply_layout(fig, **kwargs):
    layout = {**PLOTLY_LAYOUT, **kwargs}
    fig.update_layout(**layout)
    return fig

# ── DATA LOAD ──────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    df = pd.read_csv("data/cleaned/orders_clean.csv")
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["ship_date"]  = pd.to_datetime(df["ship_date"])
    df["month"]      = df["order_date"].dt.month
    df["month_name"] = df["order_date"].dt.strftime("%b")
    df["quarter"]    = df["order_date"].dt.quarter
    df["year"]       = df["order_date"].dt.year
    return df

df = load_data()

# ── SIDEBAR ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("""
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
      <div style="width:32px;height:32px;background:#5b6af0;border-radius:8px;
                  display:flex;align-items:center;justify-content:center;
                  font-weight:700;font-size:14px;color:#fff;">RD</div>
      <div>
        <div style="font-size:0.85rem;font-weight:600;color:#e0e0f5 !important;">Retail DWH</div>
        <div style="font-size:0.7rem;color:rgba(210,210,235,0.45) !important;">Sales Analysis</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    section = st.selectbox(
        "NAVIGATION",
        ["Sales Overview", "Customer Analytics", "Product Analytics", "Time Analysis", "Insights"],
    )

    st.markdown("---")

    years = sorted(df["year"].unique().tolist())
    selected_years = st.multiselect("YEAR", years, default=years)

    categories = sorted(df["category"].unique().tolist())
    selected_cats = st.multiselect("CATEGORY", categories, default=categories)

    regions = sorted(df["region"].unique().tolist())
    selected_regions = st.multiselect("REGION", regions, default=regions)

    st.markdown("---")

    st.markdown("""
    <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.08em;
                color:rgba(210,210,235,0.35);margin-bottom:8px;">Tech Stack</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;">
    """ + "".join(
        f'<span style="font-size:0.68rem;background:rgba(255,255,255,0.07);'
        f'color:rgba(210,210,235,0.55);padding:2px 8px;border-radius:20px;">{t}</span>'
        for t in ["PostgreSQL", "Python", "Pandas", "Plotly", "Streamlit"]
    ) + """
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    st.markdown("""
    <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.08em;
                color:rgba(210,210,235,0.35);margin-bottom:6px;">Data Source</div>
    <a href="https://www.kaggle.com/datasets/thuandao/superstore-sales-analytics/data"
       style="font-size:0.75rem;color:#8090e0;text-decoration:none;display:block;margin-bottom:2px;">
      ↗ Kaggle — Superstore Sales Analytics
    </a>
    <div style="font-size:0.68rem;color:rgba(210,210,235,0.30);line-height:1.5;">
      51,290 order lines · Global retail · 2011–2014
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    st.markdown("""
    <div style="background:rgba(255,255,255,0.04);border-radius:8px;
                border:0.5px solid rgba(255,255,255,0.08);padding:10px 12px;margin-bottom:12px;">
      <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;
                  color:rgba(210,210,235,0.35);margin-bottom:5px;">⚠ Note</div>
      <div style="font-size:0.71rem;color:rgba(210,210,235,0.40);line-height:1.55;">
        This app reads directly from a <strong style="color:rgba(210,210,235,0.55);">CSV via pandas</strong>
        — not the PostgreSQL database. It's a standalone showcase of the same dataset.
        The full DWH project (star schema, ETL, Power BI) lives in the GitHub repo.
      </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div style="font-size:0.72rem;color:rgba(210,210,235,0.35);">Author</div>
    <div style="font-size:0.82rem;color:rgba(210,210,235,0.65);margin-bottom:6px;">Jovan Paić</div>
    <a href="https://github.com/jpaic/retail-data-warehouse"
       style="font-size:0.75rem;color:#8090e0;text-decoration:none;">
      ↗ GitHub Repository
    </a>
    """, unsafe_allow_html=True)

# ── FILTER ─────────────────────────────────────────────────────────────────────
fdf = df[
    df["year"].isin(selected_years) &
    df["category"].isin(selected_cats) &
    df["region"].isin(selected_regions)
]

def metric_card(label, value, sub=""):
    return f"""
    <div class="metric-card">
        <div class="m-label">{label}</div>
        <div class="m-value">{value}</div>
        <div class="m-sub">{sub}</div>
    </div>"""

def fmt_currency(v): return f"${v:,.0f}"
def fmt_number(v):   return f"{v:,.0f}"

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — SALES OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
if section == "Sales Overview":

    st.markdown('<div class="section-badge">01 — Overview</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Sales Overview</div>', unsafe_allow_html=True)

    total_revenue = fdf["sales"].sum()
    total_profit  = fdf["profit"].sum()
    total_orders  = len(fdf)
    avg_order_val = total_revenue / total_orders if total_orders else 0
    profit_margin = (total_profit / total_revenue * 100) if total_revenue else 0

    st.markdown(f"""
    <div class="metric-row">
      {metric_card("Total Revenue",   fmt_currency(total_revenue), "across all markets")}
      {metric_card("Total Profit",    fmt_currency(total_profit),  "net profit")}
      {metric_card("Total Orders",    fmt_number(total_orders),    "order lines")}
      {metric_card("Avg Order Value", fmt_currency(avg_order_val), "per order line")}
      {metric_card("Profit Margin",   f"{profit_margin:.1f}%",     "revenue to profit")}
    </div>
    """, unsafe_allow_html=True)

    # Weekly revenue & profit trend
    st.markdown("##### Weekly revenue & profit trend")
    trend = (fdf.set_index("order_date")[["sales","profit"]]
               .resample("W").sum().reset_index())
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=trend["order_date"], y=trend["sales"],
        fill="tozeroy", fillcolor=f"rgba(91,106,240,0.1)",
        line=dict(color=INDIGO, width=2), name="Revenue",
        hovertemplate="<b>%{x|%b %d, %Y}</b><br>Revenue: $%{y:,.0f}<extra></extra>",
    ))
    fig.add_trace(go.Scatter(
        x=trend["order_date"], y=trend["profit"],
        line=dict(color=TEAL, width=2), name="Profit",
        hovertemplate="<b>%{x|%b %d, %Y}</b><br>Profit: $%{y:,.0f}<extra></extra>",
    ))
    apply_layout(fig, height=320, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
    st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("##### Revenue by market")
        mkt = (fdf.groupby("market")["sales"].sum().sort_values().reset_index())
        fig = px.bar(mkt, x="sales", y="market", orientation="h",
                     color_discrete_sequence=[INDIGO],
                     labels={"sales": "Revenue (USD)", "market": ""},
                     custom_data=["market"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{x:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=320, xaxis_tickprefix="$", xaxis_tickformat=",.0f")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.markdown("##### Revenue by ship mode")
        ship = (fdf.groupby("ship_mode")["sales"].sum().sort_values().reset_index())
        fig = px.bar(ship, x="sales", y="ship_mode", orientation="h",
                     color="ship_mode",
                     color_discrete_sequence=PALETTE,
                     labels={"sales": "Revenue (USD)", "ship_mode": ""},
                     custom_data=["ship_mode"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{x:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=320, xaxis_tickprefix="$", xaxis_tickformat=",.0f",
                     showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Revenue by order priority")
    pri = (fdf.groupby("order_priority")["sales"]
              .sum().sort_values(ascending=False).reset_index())
    fig = px.bar(pri, x="order_priority", y="sales",
                 color="order_priority",
                 color_discrete_sequence=PALETTE,
                 labels={"sales": "Revenue (USD)", "order_priority": ""},
                 custom_data=["order_priority"])
    fig.update_traces(
        hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{y:,.0f}<extra></extra>"
    )
    apply_layout(fig, height=280, yaxis_tickprefix="$", yaxis_tickformat=",.0f",
                 showlegend=False)
    st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — CUSTOMER ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════
elif section == "Customer Analytics":

    st.markdown('<div class="section-badge">02 — Customers</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Customer Analytics</div>', unsafe_allow_html=True)

    total_customers = fdf["customer_name"].nunique()
    top_customer    = fdf.groupby("customer_name")["sales"].sum().idxmax()
    top_rev         = fdf.groupby("customer_name")["sales"].sum().max()
    consumer_pct    = (fdf[fdf["segment"] == "Consumer"]["sales"].sum()
                       / fdf["sales"].sum() * 100)

    st.markdown(f"""
    <div class="metric-row">
      {metric_card("Unique Customers", fmt_number(total_customers), "distinct names")}
      {metric_card("Top Customer",     top_customer,                "by revenue")}
      {metric_card("Top Revenue",      fmt_currency(top_rev),       "single customer")}
      {metric_card("Consumer Share",   f"{consumer_pct:.1f}%",      "of total revenue")}
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([2, 1])

    with col1:
        st.markdown("##### Top 15 customers by revenue")
        top_c = (fdf.groupby("customer_name")["sales"]
                    .sum().sort_values(ascending=True)
                    .tail(15).reset_index())
        fig = px.bar(top_c, x="sales", y="customer_name", orientation="h",
                     color_discrete_sequence=[INDIGO],
                     labels={"sales": "Revenue (USD)", "customer_name": ""},
                     custom_data=["customer_name"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{x:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=420, xaxis_tickprefix="$", xaxis_tickformat=",.0f")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.markdown("##### Revenue by segment")
        seg = fdf.groupby("segment")["sales"].sum().reset_index()
        fig = px.pie(seg, values="sales", names="segment",
                     color_discrete_sequence=[INDIGO, TEAL, AMBER],
                     hole=0.4)
        fig.update_traces(
            textposition="inside", textinfo="percent+label",
            hovertemplate="<b>%{label}</b><br>Revenue: $%{value:,.0f}<br>Share: %{percent}<extra></extra>"
        )
        apply_layout(fig, height=420, showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Revenue by region")
    reg = (fdf.groupby("region")["sales"]
              .sum().sort_values(ascending=False).reset_index())
    fig = px.bar(reg, x="region", y="sales",
                 color="region",
                 color_discrete_sequence=[INDIGO] + ["#b0b8f8"] * (len(reg) - 1),
                 labels={"sales": "Revenue (USD)", "region": ""},
                 custom_data=["region"])
    fig.update_traces(
        hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{y:,.0f}<extra></extra>"
    )
    apply_layout(fig, height=300, yaxis_tickprefix="$", yaxis_tickformat=",.0f",
                 showlegend=False, xaxis_tickangle=-30)
    st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("##### Revenue by segment × year")
        seg_yr = (fdf.groupby(["year","segment"])["sales"].sum().reset_index())
        fig = px.bar(seg_yr, x="year", y="sales", color="segment",
                     barmode="group",
                     color_discrete_sequence=[INDIGO, TEAL, AMBER],
                     labels={"sales": "Revenue (USD)", "year": "Year", "segment": "Segment"},
                     custom_data=["segment"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b> — %{x}<br>Revenue: $%{y:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=320, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.markdown("##### Profit margin by segment")
        seg_m = fdf.groupby("segment").agg(
            revenue=("sales","sum"), profit=("profit","sum")).reset_index()
        seg_m["margin"] = seg_m["profit"] / seg_m["revenue"] * 100
        avg_margin = seg_m["margin"].mean()
        fig = px.bar(seg_m, x="segment", y="margin",
                     color_discrete_sequence=[INDIGO, TEAL, AMBER],
                     color="segment",
                     labels={"margin": "Margin (%)", "segment": ""},
                     custom_data=["segment"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Margin: %{y:.1f}%<extra></extra>"
        )
        fig.add_hline(y=avg_margin, line_dash="dash", line_color=AMBER,
                      annotation_text=f"avg {avg_margin:.1f}%",
                      annotation_position="top right")
        apply_layout(fig, height=320, yaxis_ticksuffix="%", showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 — PRODUCT ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════
elif section == "Product Analytics":

    st.markdown('<div class="section-badge">03 — Products</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Product Analytics</div>', unsafe_allow_html=True)

    total_products = fdf["product_id"].nunique()
    best_cat       = fdf.groupby("category")["sales"].sum().idxmax()
    best_sub       = fdf.groupby("sub_category")["sales"].sum().idxmax()
    avg_discount   = fdf["discount"].mean() * 100

    st.markdown(f"""
    <div class="metric-row">
      {metric_card("Unique Products",   fmt_number(total_products), "distinct SKUs")}
      {metric_card("Best Category",     best_cat,                   "by revenue")}
      {metric_card("Best Sub-Category", best_sub,                   "by revenue")}
      {metric_card("Avg Discount",      f"{avg_discount:.1f}%",     "across all orders")}
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("##### Revenue by category")
        cat = (fdf.groupby("category")["sales"]
                  .sum().sort_values(ascending=False).reset_index())
        fig = px.bar(cat, x="category", y="sales",
                     color="category",
                     color_discrete_sequence=[INDIGO, TEAL, AMBER],
                     labels={"sales": "Revenue (USD)", "category": ""},
                     custom_data=["category"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{y:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=320, yaxis_tickprefix="$", yaxis_tickformat=",.0f",
                     showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.markdown("##### Profit margin by category")
        cat_m = fdf.groupby("category").agg(
            revenue=("sales","sum"), profit=("profit","sum")).reset_index()
        cat_m["margin"] = cat_m["profit"] / cat_m["revenue"] * 100
        fig = px.bar(cat_m, x="category", y="margin",
                     color="margin",
                     color_continuous_scale=[[0, PINK], [0.5, AMBER], [1, TEAL]],
                     labels={"margin": "Margin (%)", "category": ""},
                     custom_data=["category"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b><br>Margin: %{y:.1f}%<extra></extra>"
        )
        fig.add_hline(y=0, line_color="#e0e0ec")
        apply_layout(fig, height=320, yaxis_ticksuffix="%",
                     coloraxis_showscale=False)
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Revenue & profit by sub-category")
    sub = (fdf.groupby("sub_category")
              .agg(revenue=("sales","sum"), profit=("profit","sum"))
              .sort_values("revenue", ascending=False)
              .reset_index())
    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=sub["sub_category"], y=sub["revenue"], name="Revenue",
        marker_color=INDIGO, opacity=0.85,
        hovertemplate="<b>%{x}</b><br>Revenue: $%{y:,.0f}<extra></extra>",
    ))
    fig.add_trace(go.Bar(
        x=sub["sub_category"], y=sub["profit"], name="Profit",
        marker_color=TEAL, opacity=0.85,
        hovertemplate="<b>%{x}</b><br>Profit: $%{y:,.0f}<extra></extra>",
    ))
    fig.update_layout(barmode="group", xaxis_tickangle=-35)
    apply_layout(fig, height=360, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
    st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Top 10 products by revenue")
    top_p = (fdf.groupby("product_name")["sales"]
                .sum().sort_values(ascending=True)
                .tail(10).reset_index())
    fig = px.bar(top_p, x="sales", y="product_name", orientation="h",
                 color_discrete_sequence=[INDIGO],
                 labels={"sales": "Revenue (USD)", "product_name": ""},
                 custom_data=["product_name"])
    fig.update_traces(
        hovertemplate="<b>%{customdata[0]}</b><br>Revenue: $%{x:,.0f}<extra></extra>"
    )
    apply_layout(fig, height=360, xaxis_tickprefix="$", xaxis_tickformat=",.0f")
    st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — TIME ANALYSIS
# ══════════════════════════════════════════════════════════════════════════════
elif section == "Time Analysis":

    st.markdown('<div class="section-badge">04 — Time Analysis</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Time Analysis</div>', unsafe_allow_html=True)

    best_year    = int(fdf.groupby("year")["sales"].sum().idxmax())
    best_month_n = int(fdf.groupby("month")["sales"].sum().idxmax())
    best_month   = pd.Timestamp(2020, best_month_n, 1).strftime("%B")
    best_quarter = f"Q{int(fdf.groupby('quarter')['sales'].sum().idxmax())}"
    yoy          = fdf.groupby("year")["sales"].sum()
    growth       = ((yoy.iloc[-1] - yoy.iloc[0]) / yoy.iloc[0] * 100) if len(yoy) > 1 else 0

    st.markdown(f"""
    <div class="metric-row">
      {metric_card("Best Year",      str(best_year),   "highest revenue year")}
      {metric_card("Best Month",     best_month,       "highest revenue month")}
      {metric_card("Best Quarter",   best_quarter,     "highest revenue quarter")}
      {metric_card("Overall Growth", f"{growth:.1f}%", "first to last year")}
    </div>
    """, unsafe_allow_html=True)

    st.markdown("##### Monthly revenue by year")
    monthly = (fdf.groupby(["year","month"])["sales"].sum().reset_index())
    month_labels = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"]
    fig = go.Figure()
    year_colors = [INDIGO, TEAL, AMBER, PINK]
    for i, yr in enumerate(sorted(monthly["year"].unique())):
        yd = monthly[monthly["year"] == yr].sort_values("month")
        fig.add_trace(go.Scatter(
            x=yd["month"], y=yd["sales"],
            name=str(yr),
            line=dict(color=year_colors[i % len(year_colors)], width=2),
            mode="lines+markers", marker=dict(size=5),
            hovertemplate=f"<b>{yr}</b> — %{{x}}<br>Revenue: $%{{y:,.0f}}<extra></extra>",
        ))
    fig.update_layout(
        xaxis=dict(tickvals=list(range(1, 13)), ticktext=month_labels)
    )
    apply_layout(fig, height=340, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
    st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("##### Annual revenue")
        annual = fdf.groupby("year")["sales"].sum().reset_index()
        bar_colors = [INDIGO if yr == best_year else "#b0b8f8" for yr in annual["year"]]
        fig = go.Figure(go.Bar(
            x=annual["year"].astype(str), y=annual["sales"],
            marker_color=bar_colors, opacity=0.9,
            hovertemplate="<b>%{x}</b><br>Revenue: $%{y:,.0f}<extra></extra>",
        ))
        apply_layout(fig, height=320, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.markdown("##### Quarterly revenue by year")
        qtr = (fdf.groupby(["year","quarter"])["sales"].sum().reset_index())
        qtr["quarter_label"] = "Q" + qtr["quarter"].astype(str)
        fig = px.bar(qtr, x="quarter_label", y="sales", color="year",
                     barmode="group",
                     color_discrete_sequence=year_colors,
                     labels={"sales": "Revenue (USD)", "quarter_label": "Quarter",
                             "year": "Year"},
                     custom_data=["year"])
        fig.update_traces(
            hovertemplate="<b>%{customdata[0]}</b> — %{x}<br>Revenue: $%{y:,.0f}<extra></extra>"
        )
        apply_layout(fig, height=320, yaxis_tickprefix="$", yaxis_tickformat=",.0f")
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Seasonality heatmap — revenue by year × month")
    month_labels = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"]
    heat = (fdf.groupby(["year","month"])["sales"].sum().reset_index())
    heat_pivot = (heat.pivot(index="year", columns="month", values="sales").fillna(0))
    heat_pivot.columns = month_labels

    fig = px.imshow(
        heat_pivot,
        color_continuous_scale="Blues",
        labels=dict(color="Revenue (USD)"),
        aspect="auto",
        text_auto=False,
    )
    # Overlay text annotations
    for i, yr in enumerate(heat_pivot.index):
        for j, mn in enumerate(month_labels):
            val = heat_pivot.loc[yr, mn]
            fig.add_annotation(
                x=j, y=i,
                text=f"${val/1e3:.0f}k",
                showarrow=False,
                font=dict(size=9, color="white" if val > heat_pivot.values.max() * 0.6 else "#555"),
            )
    apply_layout(fig, height=220)
    fig.update_layout(
        xaxis=dict(tickvals=list(range(12)), ticktext=month_labels),
        yaxis=dict(tickvals=list(range(len(heat_pivot))),
                   ticktext=[str(y) for y in heat_pivot.index]),
    )
    st.plotly_chart(fig, use_container_width=True)

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 — INSIGHTS
# ══════════════════════════════════════════════════════════════════════════════
elif section == "Insights":

    st.markdown('<div class="section-badge">05 — Insights</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Key Business Insights</div>', unsafe_allow_html=True)
    st.markdown(
        '<p style="color:#888;font-size:0.88rem;margin-top:-12px;margin-bottom:24px;">'
        'Findings derived from 51,290 order lines · $12.6M total revenue · 2011–2014</p>',
        unsafe_allow_html=True,
    )

    # ── Revenue & Scale
    st.markdown("#### Revenue & Scale")
    st.markdown("""
    <div class="insight-card">
      <span class="insight-badge badge-revenue">Revenue</span>
      <h4>$12.6M across 51,290 orders — consistent year-over-year growth</h4>
      <p>The business scaled steadily from 2011 to 2014, with 2014 marking the peak revenue year
      across all markets and segments. Revenue grew consistently each year, indicating a healthy
      demand trajectory without signs of saturation.</p>
    </div>
    <div class="insight-card">
      <span class="insight-badge badge-revenue">Revenue</span>
      <h4>APAC is the #1 global market by revenue</h4>
      <p>The Asia-Pacific market leads all regions in total revenue, outpacing EMEA, USCA, and LATAM.
      This makes APAC the most critical market to defend and invest in for continued growth.
      EU ranks closely behind APAC, making it a strong secondary focus.</p>
    </div>
    <div class="insight-card">
      <span class="insight-badge badge-revenue">Revenue</span>
      <h4>Standard Class shipping dominates — but may mask fulfillment risk</h4>
      <p>Standard Class accounts for the largest share of revenue by ship mode. While cost-efficient,
      over-reliance on a single fulfillment method creates concentration risk. First Class and Same Day
      orders represent a premium segment worth nurturing for higher-value customers.</p>
    </div>
    """, unsafe_allow_html=True)

    # ── Customer Analytics
    st.markdown("#### Customer Analytics")
    st.markdown("""
    <div class="insight-card teal">
      <span class="insight-badge badge-customer">Customers</span>
      <h4>Consumer segment drives the largest share of order volume</h4>
      <p>The Consumer segment consistently contributes the highest proportion of total revenue
      across all years. Corporate and Home Office segments, while smaller in volume, tend to place
      higher-value individual orders — making them efficient revenue contributors per transaction.</p>
    </div>
    <div class="insight-card teal">
      <span class="insight-badge badge-customer">Customers</span>
      <h4>Top customers are highly concentrated in APAC and EU</h4>
      <p>The highest-revenue individual customers are geographically clustered in the APAC and EU
      markets. This concentration suggests that regional account management programs in these markets
      could disproportionately protect and grow top-line revenue.</p>
    </div>
    <div class="insight-card teal">
      <span class="insight-badge badge-customer">Customers</span>
      <h4>Segment revenue growth is broad-based — not driven by a single cohort</h4>
      <p>Year-over-year revenue increases were observed across all three segments (Consumer, Corporate,
      Home Office), indicating that growth is systemic rather than dependent on a single customer type.
      This reduces segment concentration risk in the revenue mix.</p>
    </div>
    """, unsafe_allow_html=True)

    # ── Product Analytics
    st.markdown("#### Product Analytics")
    st.markdown("""
    <div class="insight-card amber">
      <span class="insight-badge badge-product">Products</span>
      <h4>Technology is the top category — Phones and Copiers lead sub-categories</h4>
      <p>Technology outperforms Furniture and Office Supplies in total revenue. Within Technology,
      Phones and Copiers are the strongest sub-categories. These high-ASP items anchor the revenue
      mix and should be prioritised in marketing and inventory planning.</p>
    </div>
    <div class="insight-card amber">
      <span class="insight-badge badge-product">Products</span>
      <h4>Office Supplies leads in order volume but at thinner margins</h4>
      <p>Despite generating significant order volume, Office Supplies operates at lower per-order
      revenue and margin compared to Technology. This creates a high cost-to-serve dynamic.
      Bundling Office Supplies with higher-margin categories could improve overall basket economics.</p>
    </div>
    <div class="insight-card amber">
      <span class="insight-badge badge-product">Products</span>
      <h4>Discounts erode margins — average 15%+ discount applied across all orders</h4>
      <p>The average discount rate applied across the dataset is substantial. Analysis shows a
      negative correlation between discount depth and profit margin, particularly in the Furniture
      category. A targeted discount reduction strategy — especially on already low-margin sub-categories
      like Tables — could materially improve profitability.</p>
    </div>
    """, unsafe_allow_html=True)

    # ── Seasonality & Time
    st.markdown("#### Seasonality & Time")
    st.markdown("""
    <div class="insight-card pink">
      <span class="insight-badge badge-time">Time</span>
      <h4>Q4 seasonality spike is consistent across all four years</h4>
      <p>A clear end-of-year purchasing surge is visible every year in Q4, driven by November and
      December. This pattern holds across markets and segments, suggesting it is demand-structural
      rather than promotional. Supply chain and inventory planning should account for this
      predictable surge 6–8 weeks in advance.</p>
    </div>
    <div class="insight-card pink">
      <span class="insight-badge badge-time">Time</span>
      <h4>Q1 is consistently the weakest quarter — a rebound opportunity</h4>
      <p>Revenue dips sharply in Q1 (January–March) every year following the Q4 peak. This seasonal
      trough represents an opportunity to deploy demand-generation campaigns and promotions to
      smooth the revenue curve and reduce quarterly volatility.</p>
    </div>
    <div class="insight-card pink">
      <span class="insight-badge badge-time">Time</span>
      <h4>2014 was the strongest year — momentum into future years looks solid</h4>
      <p>2014 recorded the highest annual revenue across all markets, with month-over-month growth
      from 2011 confirming a multi-year compound growth trajectory. The data ends at 2014, but the
      trend line points clearly upward — consistent with a healthy, expanding retail operation.</p>
    </div>
    """, unsafe_allow_html=True)

    # ── Architecture note
    st.markdown("---")
    st.markdown("""
    <div style="background:rgba(91,106,240,0.04);border-radius:10px;padding:18px 22px;
                border:0.5px solid rgba(91,106,240,0.15);">
      <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;
                  color:#5b6af0;margin-bottom:8px;">About this project</div>
      <p style="font-size:0.83rem;color:#555;line-height:1.65;margin:0;">
        Built as an end-to-end retail data warehouse on PostgreSQL with a star schema
        (<code>fact_sales</code> joined to <code>dim_customers</code>, <code>dim_products</code>,
        <code>dim_geography</code>, <code>dim_date</code>). ETL covers raw ingestion → staging
        (type casting, deduplication, null validation) → dimensional modelling → pre-aggregated
        dashboard views. Data quality checks confirmed 51,290 fact rows and $12,642,905 in
        reconciled revenue with zero orphan keys.
        <a href="https://github.com/jpaic/retail-data-warehouse"
           style="color:#5b6af0;text-decoration:none;">↗ View on GitHub</a>
      </p>
    </div>
    """, unsafe_allow_html=True)