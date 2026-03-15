import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_val_score
import os


# Map brands to pricing tiers (1=budget, 2=mid, 3=premium, 4=luxury)
BRAND_TIER_MAP = {
    'Maruti Suzuki': 1, 'Tata': 1, 'Renault': 1, 'Nissan': 1, 'Isuzu': 1,
    'Force': 1, 'Datsun': 1, 'Chevrolet': 1, 'Fiat': 1, 'Ambassador': 1,
    'Opel': 1, 'Daewoo': 1, 'Ashok': 1,
    'Hyundai': 2, 'Kia': 2, 'Honda': 2, 'Skoda': 2, 'Volkswagen': 2,
    'MG': 2, 'Mahindra': 2, 'Toyota': 2, 'Jeep': 2, 'Ford': 2,
    'Bmw': 3, 'Mercedes-Benz': 3, 'Audi': 3, 'Volvo': 3, 'Mini': 3,
    'Jaguar': 3, 'Land Rover': 3, 'Lexus': 3,
    'Porsche': 4, 'Ferrari': 4, 'Lamborghini': 4, 'Rolls-Royce': 4,
    'Maserati': 4, 'Bentley': 4,
}


class CarPriceModel:
    """Loads cars_india.csv (Kaggle CarDekho), trains GradientBoosting."""

    def __init__(self):
        self.model = None
        self.df = None
        self.encoders = {}
        self.feature_cols = []
        self.cat_cols = ['brand', 'body_type', 'fuel_type', 'segment',
                         'transmission', 'condition', 'reg_type']
        self.num_cols = ['year', 'age', 'mileage_k', 'engine_vol', 'owners',
                         'mileage_per_year', 'age_squared', 'brand_tier']
        self._load_and_train()

    def _load_and_train(self):
        csv_path = os.path.join(os.path.dirname(__file__), "..", "cars_india.csv")
        self.df = pd.read_csv(csv_path)

        train_df = self.df.copy()

        # Label-encode categoricals
        for col in self.cat_cols:
            le = LabelEncoder()
            train_df[col + '_enc'] = le.fit_transform(train_df[col])
            self.encoders[col] = le

        self.feature_cols = [c + '_enc' for c in self.cat_cols] + self.num_cols

        X = train_df[self.feature_cols]
        y = train_df['price_inr']

        # Train Gradient Boosting
        self.model = GradientBoostingRegressor(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.08,
            min_samples_split=10,
            subsample=0.85,
            random_state=42,
        )
        self.model.fit(X, y)
        self.train_score = round(self.model.score(X, y), 4)

        # Cross-validation score
        cv_scores = cross_val_score(self.model, X, y, cv=5, scoring='r2')
        self.cv_score = round(cv_scores.mean(), 4)

        # Feature importance
        importances = self.model.feature_importances_
        self.feature_importance = {
            name: round(float(imp), 4)
            for name, imp in sorted(zip(self.feature_cols, importances), key=lambda x: -x[1])
        }

        print(f"Model trained on {len(self.df)} records. Train R²={self.train_score}, CV R²={self.cv_score}")
        print(f"Top features: {list(self.feature_importance.items())[:5]}")

    def predict(self, brand, body_type, year, month, mileage_k, engine_vol,
                fuel_type, transmission, condition, owners, reg_type, segment):
        """Predict price for given car specs."""
        fractional_year = year + (month - 1) / 12
        age = 2026.25 - fractional_year
        row = {}

        cat_values = {
            'brand': brand, 'body_type': body_type, 'fuel_type': fuel_type,
            'segment': segment, 'transmission': transmission,
            'condition': condition, 'reg_type': reg_type,
        }

        for col, val in cat_values.items():
            le = self.encoders[col]
            if val in le.classes_:
                row[col + '_enc'] = le.transform([val])[0]
            else:
                row[col + '_enc'] = 0

        # Numeric features
        row['year'] = year
        row['age'] = round(age, 1)
        row['mileage_k'] = mileage_k
        row['engine_vol'] = engine_vol
        row['owners'] = owners
        row['mileage_per_year'] = round(mileage_k / max(age, 0.5), 1)
        row['age_squared'] = round(age ** 2, 1)
        row['brand_tier'] = BRAND_TIER_MAP.get(brand, 2)

        X = pd.DataFrame([row])[self.feature_cols]
        pred = self.model.predict(X)[0]

        margin = pred * 0.12
        low = max(round(pred - margin, 0), 0)
        high = round(pred + margin, 0)

        return {
            'price': max(round(pred, 0), 0),
            'price_low': low,
            'price_high': high,
        }

    def get_options(self):
        return {
            'brands': sorted(self.df['brand'].unique().tolist()),
            'body_types': sorted(self.df['body_type'].unique().tolist()),
            'fuel_types': sorted(self.df['fuel_type'].unique().tolist()),
            'segments': sorted(self.df['segment'].unique().tolist()),
            'transmissions': sorted(self.df['transmission'].unique().tolist()),
            'conditions': ['Excellent', 'Good', 'Fair', 'Poor'],
            'reg_types': ['Private', 'Taxi', 'Bharat'],
            'year_range': {'min': int(self.df['year'].min()), 'max': 2026},
            'months': list(range(1, 13)),
            'mileage_range': {'min': 0, 'max': int(self.df['mileage_k'].max())},
            'engine_vol_range': {
                'min': float(self.df['engine_vol'].min()),
                'max': float(self.df['engine_vol'].max()),
            },
        }

    def get_dataset(self):
        return self.df.to_dict(orient='records')

    def get_stats(self):
        num_df = self.df[['year', 'mileage_k', 'engine_vol', 'owners', 'price_inr']]
        desc = num_df.describe().round(1).to_dict()
        corr = num_df.corr().round(4).to_dict()
        return {
            'describe': desc,
            'correlation': corr,
            'total_records': len(self.df),
            'train_accuracy': self.train_score,
            'cv_accuracy': self.cv_score,
            'feature_importance': self.feature_importance,
        }

    def get_brand_data(self):
        counts = self.df['brand'].value_counts().to_dict()
        avg_price = self.df.groupby('brand')['price_inr'].mean().round(0).to_dict()
        return {'counts': counts, 'avg_price': avg_price}

    def get_scatter_data(self, feature):
        valid = ['mileage_k', 'engine_vol', 'year', 'age', 'owners']
        if feature not in valid:
            feature = 'mileage_k'
        return {
            'x': self.df[feature].tolist(),
            'y': self.df['price_inr'].tolist(),
            'feature': feature,
        }

    def get_body_data(self):
        counts = self.df['body_type'].value_counts().to_dict()
        avg_price = self.df.groupby('body_type')['price_inr'].mean().round(0).to_dict()
        return {'counts': counts, 'avg_price': avg_price}

    def get_segment_data(self):
        counts = self.df['segment'].value_counts().to_dict()
        avg_price = self.df.groupby('segment')['price_inr'].mean().round(0).to_dict()
        return {'counts': counts, 'avg_price': avg_price}
