/*
 * This file is generated by jOOQ.
 */
package edu.uci.ics.texera.dataflow.jooq.generated;


import edu.uci.ics.texera.dataflow.jooq.generated.tables.Useraccount;
import edu.uci.ics.texera.dataflow.jooq.generated.tables.Userdict;
import edu.uci.ics.texera.dataflow.jooq.generated.tables.Userfile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.jooq.Catalog;
import org.jooq.Table;
import org.jooq.impl.SchemaImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Texera extends SchemaImpl {

    private static final long serialVersionUID = -398729029;

    /**
     * The reference instance of <code>texera</code>
     */
    public static final Texera TEXERA = new Texera();

    /**
     * The table <code>texera.useraccount</code>.
     */
    public final Useraccount USERACCOUNT = edu.uci.ics.texera.dataflow.jooq.generated.tables.Useraccount.USERACCOUNT;

    /**
     * The table <code>texera.userdict</code>.
     */
    public final Userdict USERDICT = edu.uci.ics.texera.dataflow.jooq.generated.tables.Userdict.USERDICT;

    /**
     * The table <code>texera.userfile</code>.
     */
    public final Userfile USERFILE = edu.uci.ics.texera.dataflow.jooq.generated.tables.Userfile.USERFILE;

    /**
     * No further instances allowed
     */
    private Texera() {
        super("texera", null);
    }


    @Override
    public Catalog getCatalog() {
        return DefaultCatalog.DEFAULT_CATALOG;
    }

    @Override
    public final List<Table<?>> getTables() {
        List result = new ArrayList();
        result.addAll(getTables0());
        return result;
    }

    private final List<Table<?>> getTables0() {
        return Arrays.<Table<?>>asList(
            Useraccount.USERACCOUNT,
            Userdict.USERDICT,
            Userfile.USERFILE);
    }
}
