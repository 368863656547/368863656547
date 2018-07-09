﻿CREATE TABLE [dbo].[Products]
(
	[ProductId] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [Description] VARCHAR(255) NOT NULL, 
    [Image] VARBINARY(65536) NULL, 
    [Price] NUMERIC(13, 2) NOT NULL, 
    [Name] VARCHAR(255) NOT NULL
)
