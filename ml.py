import pandas as pd
import pickle
from sklearn.linear_model import Ridge

weather = pd.read_csv('3290952.csv', index_col='DATE')
core_weather = weather[['PRCP', 'TMAX', 'TMIN']].copy()

core_weather=core_weather.fillna(method='ffill')
core_weather.apply(pd.isnull).sum()/core_weather.shape[0]
core_weather.index=pd.to_datetime(core_weather.index)
core_weather['target']=core_weather.shift(-1)['TMAX']
core_weather.dropna(inplace=True)



reg = Ridge(alpha=0.1)
predictors = ['PRCP', 'TMAX', 'TMIN']  # Updated predictor column names
train = core_weather.loc[:"2020-12-31"]
test = core_weather.loc["2021-01-01":]
core_weather[pd.isnull(core_weather['PRCP'])]

reg.fit(train[predictors], train['target'])  # Assuming 'target' is the target column name
print(core_weather)
filename = 'trained_model.sav'
with open(filename, 'wb') as f:  # Using 'with' statement for file handling
    pickle.dump(reg, f)
