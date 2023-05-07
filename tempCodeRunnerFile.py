import pandas as pd
import pickle
from sklearn.linear_model import Ridge

weather=pd.read_csv('3290952.csv',index_col='DATE')
core_weather=weather[['PRCP','TMAX','TMIN']].copy()
print(weather)


reg=Ridge(alpha=.1)
predictors=['Precip','tmax','tmin']
train = core_weather.loc[:"2020-12-31"]
test= core_weather.loc["2021-01-01":]
reg.fit(train[predictors],train['target'])


filename='trained_model.sav'
f=open(filename, 'wb')
pickle.dump(reg,f)
f.close()